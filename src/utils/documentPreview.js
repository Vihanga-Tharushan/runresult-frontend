const GOOGLE_SHEET_ID = /\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/
const GOOGLE_FILE_ID = /\/file\/d\/([a-zA-Z0-9_-]+)/
const GENERIC_DRIVE_ID = /\/d\/([a-zA-Z0-9_-]+)/

export function isGoogleSheetsUrl(url) {
  return /docs\.google\.com\/spreadsheets/i.test(url || '')
}

export function isGoogleDriveUrl(url) {
  return /drive\.google\.com/i.test(url || '')
}

export function isPdfUrl(url) {
  return /\.pdf(\?|#|$)/i.test(url || '')
}

export function isSpreadsheetFileUrl(url) {
  return /\.(xlsx|xls|csv|ods)(\?|#|$)/i.test(url || '')
}

export function extractGoogleId(url) {
  if (!url) return null
  const sheet = url.match(GOOGLE_SHEET_ID)
  if (sheet) return sheet[1]
  const file = url.match(GOOGLE_FILE_ID)
  if (file) return file[1]
  const generic = url.match(GENERIC_DRIVE_ID)
  return generic ? generic[1] : null
}

export function extractGid(url) {
  if (!url) return null
  const match = url.match(/[#&]gid=([a-zA-Z0-9_-]+)/)
  return match ? match[1] : null
}

export function detectDocumentType(url, fallback = 'pdf') {
  if (!url) return fallback
  if (isGoogleSheetsUrl(url)) return 'spreadsheet'
  if (isGoogleDriveUrl(url)) return 'drive'
  if (isPdfUrl(url)) return 'pdf'
  if (isSpreadsheetFileUrl(url)) return 'spreadsheet'
  return fallback
}

export function buildDocumentEmbedUrl(url, type) {
  if (!url) return null

  const resolved = detectDocumentType(url, type || 'pdf')

  if (resolved === 'spreadsheet') {
    const id = extractGoogleId(url)

    if (isGoogleSheetsUrl(url) && id) {
      const gid = extractGid(url)
      const params = new URLSearchParams({ rm: 'minimal', chrome: 'false', toolbar: '0', showNav: '0', showSheetTabs: '0' })
      if (gid) params.set('gid', gid)
      return `https://docs.google.com/spreadsheets/d/${id}/preview?${params.toString()}`
    }

    if (isGoogleDriveUrl(url) && id) {
      return `https://drive.google.com/file/d/${id}/preview`
    }

    return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`
  }

  if (resolved === 'drive') {
    const id = extractGoogleId(url)
    return id ? `https://drive.google.com/file/d/${id}/preview` : null
  }

  return `${url}#view=FitH&toolbar=0`
}

export function buildGoogleSheetEmbedUrl(url) {
  const id = extractGoogleId(url)
  return id ? `https://docs.google.com/spreadsheets/d/${id}/preview` : null
}
