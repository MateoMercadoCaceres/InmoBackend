const { supabase } = require('../config/supabase')
const DatabaseError = require('../errors/DatabaseError')

const FIELDS = 'id, property_id, media_type, media_folder_url'

async function findByProperty(property_id) {
  const { data, error } = await supabase
    .from('property_media')
    .select(FIELDS)
    .eq('property_id', property_id)

  if (error) throw new DatabaseError(error.message)
  return data
}

async function create(payload) {
  const { data, error } = await supabase
    .from('property_media')
    .insert(payload)
    .select(FIELDS)
    .single()

  if (error) throw new DatabaseError(error.message)
  return data
}

async function remove(id) {
  const { error } = await supabase
    .from('property_media')
    .delete()
    .eq('id', id)

  if (error) throw new DatabaseError(error.message)
}

module.exports = { findByProperty, create, remove }
