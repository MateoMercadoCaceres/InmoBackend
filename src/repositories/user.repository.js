const { supabase } = require('../config/supabase')
const DatabaseError = require('../errors/DatabaseError')

// cell_phone is stored as int8 in the DB; the API keeps exposing it as `phone`
// so existing consumers don't need to change.
const FIELDS = 'id, name, email, role, cell_phone'

function mapUser(row) {
  if (!row) return row
  const { cell_phone, ...rest } = row
  return { ...rest, phone: cell_phone != null ? String(cell_phone) : null }
}

function toDbPayload(payload) {
  if (payload.phone === undefined) return payload
  const { phone, ...rest } = payload
  const digits = phone ? String(phone).replace(/\D/g, '') : ''
  return { ...rest, cell_phone: digits ? Number(digits) : null }
}

async function findAll() {
  const { data, error } = await supabase
    .from('users')
    .select(FIELDS)

  if (error) throw new DatabaseError(error.message)
  return data.map(mapUser)
}

async function findById(id) {
  const { data, error } = await supabase
    .from('users')
    .select(FIELDS)
    .eq('id', id)
    .single()

  if (error && error.code !== 'PGRST116') throw new DatabaseError(error.message)
  return mapUser(data)
}

async function findByEmail(email) {
  const { data, error } = await supabase
    .from('users')
    .select(FIELDS)
    .eq('email', email)
    .maybeSingle()

  if (error) throw new DatabaseError(error.message)
  return mapUser(data)
}

async function create(payload) {
  const { data, error } = await supabase
    .from('users')
    .insert(toDbPayload(payload))
    .select(FIELDS)
    .single()

  if (error) throw new DatabaseError(error.message)
  return mapUser(data)
}

async function update(id, payload) {
  const { data, error } = await supabase
    .from('users')
    .update(toDbPayload(payload))
    .eq('id', id)
    .select(FIELDS)
    .single()

  if (error) throw new DatabaseError(error.message)
  return mapUser(data)
}

async function remove(id) {
  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', id)

  if (error) throw new DatabaseError(error.message)
}

module.exports = { findAll, findById, findByEmail, create, update, remove }
