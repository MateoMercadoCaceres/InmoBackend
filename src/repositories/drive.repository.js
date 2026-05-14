const { supabase } = require('../config/supabase')
const DatabaseError = require('../errors/DatabaseError')

const TABLE = 'drive_tokens'
const FIELDS = 'id, access_token, refresh_token, expires_at'

async function getToken() {
  const { data, error } = await supabase
    .from(TABLE)
    .select(FIELDS)
    .limit(1)
    .maybeSingle()

  if (error) throw new DatabaseError(error.message)
  return data
}

async function upsertToken({ access_token, refresh_token, expires_at }) {
  const existing = await getToken()

  if (existing) {
    const { data, error } = await supabase
      .from(TABLE)
      .update({ access_token, refresh_token, expires_at })
      .eq('id', existing.id)
      .select(FIELDS)
      .single()

    if (error) throw new DatabaseError(error.message)
    return data
  }

  const { data, error } = await supabase
    .from(TABLE)
    .insert({ access_token, refresh_token, expires_at })
    .select(FIELDS)
    .single()

  if (error) throw new DatabaseError(error.message)
  return data
}

async function updateAccessToken(id, { access_token, expires_at }) {
  const { data, error } = await supabase
    .from(TABLE)
    .update({ access_token, expires_at })
    .eq('id', id)
    .select(FIELDS)
    .single()

  if (error) throw new DatabaseError(error.message)
  return data
}

module.exports = { getToken, upsertToken, updateAccessToken }
