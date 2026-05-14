const { google } = require('googleapis')
const driveRepository = require('../repositories/drive.repository')
const { buildOAuthClient } = require('./drive.service')
const AppError = require('../errors/AppError')

async function getDriveClient() {
  const tokenRow = await driveRepository.getToken()
  if (!tokenRow) throw new AppError('Drive not connected. Run GET /api/admin/drive/auth first.', 503)

  const oauth2Client = buildOAuthClient()

  const isExpired = new Date(tokenRow.expires_at) <= new Date()

  if (isExpired) {
    oauth2Client.setCredentials({ refresh_token: tokenRow.refresh_token })

    let refreshed
    try {
      const response = await oauth2Client.refreshAccessToken()
      refreshed = response.credentials
    } catch (err) {
      throw new AppError(`Failed to refresh Drive token: ${err.message}`, 502)
    }

    const expires_at = new Date(refreshed.expiry_date).toISOString()

    await driveRepository.updateAccessToken(tokenRow.id, {
      access_token: refreshed.access_token,
      expires_at
    })

    oauth2Client.setCredentials({
      access_token: refreshed.access_token,
      refresh_token: tokenRow.refresh_token
    })
  } else {
    oauth2Client.setCredentials({
      access_token: tokenRow.access_token,
      refresh_token: tokenRow.refresh_token
    })
  }

  return google.drive({ version: 'v3', auth: oauth2Client })
}

module.exports = { getDriveClient }
