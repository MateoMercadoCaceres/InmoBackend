const driveService = require('../services/drive.service')
const asyncHandler = require('../utils/asyncHandler')
const { sendSuccess } = require('../utils/response')

const redirectToGoogleAuth = asyncHandler(async (req, res) => {
  const url = driveService.getAuthUrl()
  res.redirect(url)
})

const handleOAuthCallback = asyncHandler(async (req, res) => {
  await driveService.handleCallback(req.query.code)
  sendSuccess(res, {})
})

module.exports = { redirectToGoogleAuth, handleOAuthCallback }
