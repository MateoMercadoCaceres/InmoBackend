const { supabase } = require('../config/supabase')
const DatabaseError = require('../errors/DatabaseError')

const FIELDS = 'id, label, order_index, created_at'

async function findAll() {
  const { data, error } = await supabase
    .from('faq_categories')
    .select(FIELDS)
    .order('order_index', { ascending: true })

  if (error) throw new DatabaseError(error.message)
  return data
}

async function findById(id) {
  const { data, error } = await supabase
    .from('faq_categories')
    .select(FIELDS)
    .eq('id', id)
    .single()

  if (error && error.code !== 'PGRST116') throw new DatabaseError(error.message)
  return data
}

async function findByLabel(label) {
  const { data, error } = await supabase
    .from('faq_categories')
    .select(FIELDS)
    .ilike('label', label)
    .maybeSingle()

  if (error) throw new DatabaseError(error.message)
  return data
}

async function countAll() {
  const { count, error } = await supabase
    .from('faq_categories')
    .select('id', { count: 'exact', head: true })

  if (error) throw new DatabaseError(error.message)
  return count ?? 0
}

async function create(payload) {
  const { data, error } = await supabase
    .from('faq_categories')
    .insert(payload)
    .select(FIELDS)
    .single()

  if (error) throw new DatabaseError(error.message)
  return data
}

async function update(id, payload) {
  const { data, error } = await supabase
    .from('faq_categories')
    .update(payload)
    .eq('id', id)
    .select(FIELDS)
    .single()

  if (error) throw new DatabaseError(error.message)
  return data
}

async function remove(id) {
  const { error } = await supabase
    .from('faq_categories')
    .delete()
    .eq('id', id)

  if (error) throw new DatabaseError(error.message)
}

module.exports = { findAll, findById, findByLabel, countAll, create, update, remove }
