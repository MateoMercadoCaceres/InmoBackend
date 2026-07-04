const { supabase } = require('../config/supabase')
const DatabaseError = require('../errors/DatabaseError')

const FIELDS = 'id, category, question, answer, order_index, created_at'

async function findAll() {
  const { data, error } = await supabase
    .from('faqs')
    .select(FIELDS)
    .order('category', { ascending: true })
    .order('order_index', { ascending: true })

  if (error) throw new DatabaseError(error.message)
  return data
}

async function findById(id) {
  const { data, error } = await supabase
    .from('faqs')
    .select(FIELDS)
    .eq('id', id)
    .single()

  if (error && error.code !== 'PGRST116') throw new DatabaseError(error.message)
  return data
}

async function countByCategory(category) {
  const { count, error } = await supabase
    .from('faqs')
    .select('id', { count: 'exact', head: true })
    .eq('category', category)

  if (error) throw new DatabaseError(error.message)
  return count ?? 0
}

async function create(payload) {
  const { data, error } = await supabase
    .from('faqs')
    .insert(payload)
    .select(FIELDS)
    .single()

  if (error) throw new DatabaseError(error.message)
  return data
}

async function update(id, payload) {
  const { data, error } = await supabase
    .from('faqs')
    .update(payload)
    .eq('id', id)
    .select(FIELDS)
    .single()

  if (error) throw new DatabaseError(error.message)
  return data
}

async function remove(id) {
  const { error } = await supabase
    .from('faqs')
    .delete()
    .eq('id', id)

  if (error) throw new DatabaseError(error.message)
}

async function updateCategoryLabel(oldLabel, newLabel) {
  const { error } = await supabase
    .from('faqs')
    .update({ category: newLabel })
    .eq('category', oldLabel)

  if (error) throw new DatabaseError(error.message)
}

module.exports = { findAll, findById, countByCategory, create, update, remove, updateCategoryLabel }
