const { supabase } = require('../config/supabase')
const DatabaseError = require('../errors/DatabaseError')

async function logStatusChange({ property_id, user_id, old_status, new_status }) {
  const { error } = await supabase
    .from('property_status_changes')
    .insert({ property_id, user_id, old_status, new_status })

  if (error) throw new DatabaseError(error.message)
}

module.exports = { logStatusChange }
