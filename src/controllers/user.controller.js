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

module.exports = { listUsers, getUser, createUser }
