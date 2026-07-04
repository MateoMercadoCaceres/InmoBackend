const { slugify } = require('./slugify')

// Titles aren't unique. The first property to claim a slug (by ascending id)
// gets the bare slug; later duplicates get "-{id}" appended so every property
// still resolves to its own URL. `rows` must be ordered by id ascending.
function buildSlugAssignments(rows) {
  const seen = new Map()
  const idToSlug = new Map()
  const slugToId = new Map()

  for (const row of rows) {
    const base = slugify(row.title)
    const count = seen.get(base) || 0
    const slug = count === 0 ? base : `${base}-${row.id}`
    seen.set(base, count + 1)
    idToSlug.set(row.id, slug)
    slugToId.set(slug, row.id)
  }

  return { idToSlug, slugToId }
}

module.exports = { buildSlugAssignments }
