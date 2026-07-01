const userService = require('../services/user.service')
const asyncHandler = require('../utils/asyncHandler')
const { sendSuccess } = require('../utils/response')

const listUsers = asyncHandler(async (req, res) => {
  const users = await userService.listUsers()
  sendSuccess(res, users)
})

const getUser = asyncHandler(async (req, res) => {
  const user = await userService.getUser(req.params.id)
  sendSuccess(res, user)
})

const createUser = asyncHandler(async (req, res) => {
  const user = await userService.createUser(req.body)
  sendSuccess(res, user, 201)
})

const updateUser = asyncHandler(async (req, res) => {
  const user = await userService.updateUser(req.params.id, req.body)
  sendSuccess(res, user)
})

const deleteUser = asyncHandler(async (req, res) => {
  await userService.deleteUser(req.params.id)
  res.status(204).send()
})

module.exports = { listUsers, getUser, createUser, updateUser, deleteUser }
