const { supabase } = require('../config/supabase')
const DatabaseError = require('../errors/DatabaseError')

const FIELDS = [
  'id', 'type_id', 'captor', 'description', 'availability_status',
  'square_meters', 'capturing_agent', 'selling_agent', 'observations',
  'capture_date', 'closing_date', 'priority', 'user_id',
  'ad_image_available', 'created_at'
].join(', ')

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
    .insert(payload)
    .select(FIELDS)
    .single()

  if (error) throw new DatabaseError(error.message)
  return data
}

async function update(id, payload) {
  const { data, error } = await supabase
    .from('properties')
    .update(payload)
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
