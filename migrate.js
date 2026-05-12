require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')
const XLSX = require('xlsx')
const path = require('path')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

// Ajusta la ruta al Excel
const EXCEL_PATH = path.join('./PROPIEDADES_STATE_CO.xlsx')

// Mapeo de estados Excel → DB
const STATUS_MAP = {
  'Disponible':     'disponibles',
  'No Disponible':  'cerrados',
  'Reservado':      'reservados',
  'Retirado':       'cerrados',
}

// Mapeo de prioridad texto → número
const PRIORITY_MAP = {
  'Alta':  1,
  'Media': 2,
  'Baja':  3,
}

function parseDate(val) {
  if (!val) return null
  // XLSX puede devolver número serial de Excel o Date
  if (val instanceof Date) return val.toISOString().split('T')[0]
  if (typeof val === 'number') {
    const d = XLSX.SSF.parse_date_code(val)
    return `${d.y}-${String(d.m).padStart(2,'0')}-${String(d.d).padStart(2,'0')}`
  }
  return null
}

async function migrate() {
  const wb = XLSX.readFile(EXCEL_PATH)
  const rows = XLSX.utils.sheet_to_json(wb.Sheets['Propiedades'], { defval: null })

  console.log(`📄 ${rows.length} propiedades encontradas en el Excel`)

  // ── 1. Insertar property_types únicos ──────────────────────────────────────
  const tipos = [...new Set(rows.map(r => r['Tipo']).filter(Boolean))]
  console.log('\n🏷️  Tipos a insertar:', tipos)

  const { data: tiposInsertados, error: tiposError } = await supabase
    .from('property_types')
    .upsert(tipos.map(name => ({ name })), { onConflict: 'name' })
    .select()

  if (tiposError) { console.error('Error property_types:', tiposError); return }

  // Mapa nombre → id
  const { data: allTipos } = await supabase.from('property_types').select('id, name')
  const tipoIdMap = Object.fromEntries(allTipos.map(t => [t.name, t.id]))
  console.log('✅ property_types listos:', tipoIdMap)

  // ── 2. Insertar users (agentes) ────────────────────────────────────────────
  const agentesSheet = XLSX.utils.sheet_to_json(wb.Sheets['Agentes'], { defval: null, header: 1 })
  const nombresAgentes = agentesSheet.map(r => r[0]).filter(Boolean)

  // También capturar agentes que aparezcan solo en propiedades
  const agentesExtra = new Set()
  rows.forEach(r => {
    if (r['Agente captador']) agentesExtra.add(r['Agente captador'])
    if (r['Agente vendedor']) agentesExtra.add(r['Agente vendedor'])
  })
  const todosAgentes = [...new Set([...nombresAgentes, ...agentesExtra])]
  console.log('\n👤 Agentes a insertar:', todosAgentes)

  const usuariosPayload = todosAgentes.map(name => ({
    name,
    email: `${name.toLowerCase().replace(/\s+/g, '.')}@stateco.com`,
    role: 'editor',
  }))

  const { error: usersError } = await supabase
    .from('users')
    .upsert(usuariosPayload, { onConflict: 'email' })

  if (usersError) { console.error('Error users:', usersError); return }

  const { data: allUsers } = await supabase.from('users').select('id, name')
  const userIdMap = Object.fromEntries(allUsers.map(u => [u.name, u.id]))
  console.log('✅ users listos')

  // ── 3. Insertar properties ─────────────────────────────────────────────────
  let ok = 0, errores = 0

  for (const row of rows) {
    const status = STATUS_MAP[row['Estado']] ?? 'cerrados'
    const typeId = tipoIdMap[row['Tipo']] ?? null
    const userId = userIdMap[row['Agente captador']] ?? null

    const property = {
      type_id:             typeId,
      captor:              row['Agente captador'] ?? 'Sin agente',
      description:         row['Nombre'] ?? 'Sin descripción',
      availability_status: status,
      square_meters:       row['Metros cuadrados'] ?? null,
      selling_agent:       row['Agente vendedor'] ?? null,
      capturing_agent:     row['Agente captador'] ?? null,
      observations:        row['Observaciones'] ?? null,
      capture_date:        parseDate(row['Fecha captacion']),
      closing_date:        parseDate(row['Fecha cierre']),
      priority:            PRIORITY_MAP[row['Prioridad']] ?? null,
      ad_image_available:  false,
      user_id:             userId,
    }

    const { data: propInserted, error: propError } = await supabase
      .from('properties')
      .insert(property)
      .select('id')
      .single()

    if (propError) {
      console.error(`❌ Error en "${row['Nombre']}":`, propError.message)
      errores++
      continue
    }

    // ── 4. Insertar property_media si hay fotos o video ──────────────────────
    const mediaRows = []

    if (row['Fotos disponibles'] === 'Si') {
      mediaRows.push({
        property_id:      propInserted.id,
        media_folder_url: `media/${row['Codigo de propiedad']}/fotos`,
        media_type:       'photo',
      })
    }

    const videoVal = (row['Video Disponible'] ?? '').toLowerCase()
    if (videoVal === 'si') {
      mediaRows.push({
        property_id:      propInserted.id,
        media_folder_url: `media/${row['Codigo de propiedad']}/video`,
        media_type:       'video',
      })
    }

    if (mediaRows.length > 0) {
      const { error: mediaError } = await supabase
        .from('property_media')
        .insert(mediaRows)

      if (mediaError) {
        console.warn(`  ⚠️  Media error en "${row['Nombre']}":`, mediaError.message)
      }
    }

    ok++
    console.log(`  ✅ ${row['Codigo de propiedad']} - ${row['Nombre']}`)
  }

  console.log(`\n🎉 Migración completa: ${ok} propiedades insertadas, ${errores} errores`)
}

migrate().catch(console.error)