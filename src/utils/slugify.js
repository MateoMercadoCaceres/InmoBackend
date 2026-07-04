const DIACRITICS_REGEX = new RegExp('[\\u0300-\\u036f]', 'g')

function slugify(text) {
  return text
    .normalize('NFD')
    .replace(DIACRITICS_REGEX, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

module.exports = { slugify }
