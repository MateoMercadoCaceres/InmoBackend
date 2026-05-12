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

module.exports = { listUsers, getUser, createUser }
