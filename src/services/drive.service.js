const { google } = require('googleapis')
const driveRepository = require('../repositories/drive.repository')
const AppError = require('../errors/AppError')

function buildOAuthClient() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  )
}

function getAuthUrl() {
  const oauth2Client = buildOAuthClient()

  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: ['https://www.googleapis.com/auth/drive']
  })
}

async function handleCallback(code) {
  if (!code) throw new AppError('Missing authorization code', 400)

  const oauth2Client = buildOAuthClient()

  let tokens
  try {
    const response = await oauth2Client.getToken(code)
    tokens = response.tokens
  } catch (err) {
    throw new AppError(`Google token exchange failed: ${err.message}`, 502)
  }

  if (!tokens.refresh_token) {
    throw new AppError(
      'No refresh_token received. Revoke app access in Google account and retry.',
      502
    )
  }

  const expires_at = new Date(tokens.expiry_date).toISOString()

  await driveRepository.upsertToken({
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    expires_at
  })
}

module.exports = { getAuthUrl, handleCallback, buildOAuthClient }
