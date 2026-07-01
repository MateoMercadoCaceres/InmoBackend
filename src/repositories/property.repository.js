const { supabase } = require('../config/supabase')
const DatabaseError = require('../errors/DatabaseError')

const FIELDS = [
  'id', 'type_id', 'title', 'category', 'captor', 'description', 'availability_status',
  'square_meters', 'capturing_agent', 'selling_agent', 'observations',
  'closing_date', 'priority', 'user_id',
  'ad_image_available', 'is_visible', 'created_at'
].join(', ')

// id/created_at are server-controlled — everything else here is safe to insert/update.
// Any other key on the incoming payload (e.g. a stale field a client still sends) is
// silently dropped instead of blowing up the whole request with a schema-cache error.
const WRITABLE_FIELDS = [
  'type_id', 'title', 'category', 'captor', 'description', 'availability_status',
  'square_meters', 'capturing_agent', 'selling_agent', 'observations',
  'closing_date', 'priority', 'user_id', 'ad_image_available', 'is_visible'
]

function pickWritable(payload) {
  const result = {}
  for (const key of WRITABLE_FIELDS) {
    if (payload[key] !== undefined) result[key] = payload[key]
  }
  return result
}

async function findAll({ limit, offset, filters }) {
  let query = supabase
    .from('properties')
    .select(FIELDS, { count: 'exact' })
    .range(offset, offset + limit - 1)

  if (filters.availability_status) query = query.eq('availability_status', filters.availability_status)
  if (filters.type_id) query = query.eq('type_id', filters.type_id)
  if (filters.priority) query = query.eq('priority', filters.priority)
  if (filters.capturing_agent) query = query.eq('capturing_agent', filters.capturing_agent)
  if (filters.selling_agent) query = query.eq('selling_agent', filters.selling_agent)

  const { data, error, count } = await query
  if (error) throw new DatabaseError(error.message)
  return { data, count }
}

async function findById(id) {
  const { data, error } = await supabase
    .from('properties')
    .select(FIELDS)
    .eq('id', id)
    .single()

  if (error && error.code !== 'PGRST116') throw new DatabaseError(error.message)
  return data
}

async function create(payload) {
  const { data, error } = await supabase
    .from('properties')
    .insert(pickWritable(payload))
    .select(FIELDS)
    .single()

  if (error) throw new DatabaseError(error.message)
  return data
}

async function update(id, payload) {
  const { data, error } = await supabase
    .from('properties')
    .update(pickWritable(payload))
    .eq('id', id)
    .select(FIELDS)
    .single()

  if (error) throw new DatabaseError(error.message)
  return data
}

async function remove(id) {
  const { error } = await supabase
    .from('properties')
    .delete()
    .eq('id', id)

  if (error) throw new DatabaseError(error.message)
}

module.exports = { findAll, findById, create, update, remove }
