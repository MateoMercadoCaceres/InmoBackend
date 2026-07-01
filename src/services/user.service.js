const userRepository = require('../repositories/user.repository')
const NotFoundError = require('../errors/NotFoundError')
const ValidationError = require('../errors/ValidationError')

async function listUsers() {
  return userRepository.findAll()
}

async function getUser(id) {
  const user = await userRepository.findById(id)
  if (!user) throw new NotFoundError(`User ${id} not found`)
  return user
}

async function createUser(payload) {
  const existing = await userRepository.findByEmail(payload.email)
  if (existing) throw new ValidationError(`User with email ${payload.email} already exists`)
  return userRepository.create(payload)
}

async function updateUser(id, payload) {
  await getUser(id)

  if (payload.email) {
    const existing = await userRepository.findByEmail(payload.email)
    if (existing && String(existing.id) !== String(id)) {
      throw new ValidationError(`User with email ${payload.email} already exists`)
    }
  }

  return userRepository.update(id, payload)
}

async function deleteUser(id) {
  await getUser(id)
  await userRepository.remove(id)
}

module.exports = { listUsers, getUser, createUser, updateUser, deleteUser }
