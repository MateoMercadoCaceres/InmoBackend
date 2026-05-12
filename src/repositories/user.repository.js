const { supabase } = require('../config/supabase')
const DatabaseError = require('../errors/DatabaseError')

const FIELDS = 'id, name, email, role'

async function findAll() {
  const { data, error } = await supabase
    .from('users')
    .select(FIELDS)

  if (error) throw new DatabaseError(error.message)
  return data
}

async function findById(id) {
  const { data, error } = await supabase
    .from('users')
    .select(FIELDS)
    .eq('id', id)
    .single()

  if (error && error.code !== 'PGRST116') throw new DatabaseError(error.message)
  return data
}

async function findByEmail(email) {
  const { data, error } = await supabase
    .from('users')
    .select(FIELDS)
    .eq('email', email)
    .maybeSingle()

  if (error) throw new DatabaseError(error.message)
  return data
}

async function create(payload) {
  const { data, error } = await supabase
    .from('users')
    .insert(payload)
    .select(FIELDS)
    .single()

  if (error) throw new DatabaseError(error.message)
  return data
}

module.exports = { findAll, findById, findByEmail, create }
