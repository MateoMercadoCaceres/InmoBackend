const { supabase } = require('../config/supabase')
const DatabaseError = require('../errors/DatabaseError')

const TABLE = 'property_drive_folders'
const FIELDS = 'id, property_id, drive_folder_id, arts_folder_id, img_folder_id, created_at'

async function create(payload) {
  const { data, error } = await supabase
    .from(TABLE)
    .insert(payload)
    .select(FIELDS)
    .single()

  if (error) throw new DatabaseError(error.message)
  return data
}

async function findByProperty(property_id) {
  const { data, error } = await supabase
    .from(TABLE)
    .select(FIELDS)
    .eq('property_id', property_id)
    .maybeSingle()

  if (error) throw new DatabaseError(error.message)
  return data
}

async function findByProperties(propertyIds) {
  if (!propertyIds.length) return []

  const { data, error } = await supabase
    .from(TABLE)
    .select(FIELDS)
    .in('property_id', propertyIds)

  if (error) throw new DatabaseError(error.message)
  return data
}

async function removeByProperty(property_id) {
  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq('property_id', property_id)

  if (error) throw new DatabaseError(error.message)
}

module.exports = { create, findByProperty, findByProperties, removeByProperty }
