import { useState, useRef, useEffect, useCallback } from 'react'
import { FileSpreadsheet, AlertTriangle, Maximize2, Minimize2 } from 'lucide-react'
import InfoBanner from './InfoBanner'

function extractSheetId(url) {
  if (!url) return null
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/)
  return match ? match[1] : null
}

function getEmbedUrl(url) {
  const id = extractSheetId(url)
  if (!id) return null
  return `https://docs.google.com/spreadsheets/d/${id}/edit?rm=minimal`
}

function isFullscreenElement(el) {
  return document.fullscreenElement === el
}

export default function SpreadsheetWorkspace({ sheetUrl, championshipName }) {
  const [loading, setLoading] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const containerRef = useRef(null)
  const iframeRef = useRef(null)

  const embedUrl = getEmbedUrl(sheetUrl)
  const hasValidUrl = !!embedUrl

  useEffect(() => {
    const onKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault()
        e.stopPropagation()
      }
    }
    const onBeforePrint = (e) => {
      e.preventDefault()
    }
    window.print = () => {}

    document.addEventListener('keydown', onKeyDown, true)
    window.addEventListener('beforeprint', onBeforePrint, true)

    return () => {
      document.removeEventListener('keydown', onKeyDown, true)
      window.removeEventListener('beforeprint', onBeforePrint, true)
    }
  }, [])

  const onFullscreenChange = useCallback(() => {
    setIsFullscreen(isFullscreenElement(containerRef.current))
  }, [])

  useEffect(() => {
    document.addEventListener('fullscreenchange', onFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange)
  }, [onFullscreenChange])

  const toggleFullscreen = async () => {
    if (!containerRef.current) return
    try {
      if (isFullscreenElement(containerRef.current)) {
        await document.exitFullscreen()
      } else {
        await containerRef.current.requestFullscreen()
      }
    } catch {
    }
  }

  return (
    <div className="space-y-4">
      <style>{`
        @media print {
          body > * { display: none !important; }
        }
      `}</style>
      <InfoBanner />

      <div
        ref={containerRef}
        className={`bg-white border border-gray-100 shadow-sm overflow-hidden ${
          isFullscreen ? 'fixed inset-0 z-9999 rounded-none border-0 flex flex-col' : 'rounded-2xl'
        }`}
      >
        {!sheetUrl || !hasValidUrl ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-6">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center mb-4">
              <AlertTriangle size={28} className="text-amber-500" />
            </div>
            <h3 className="text-lg font-bold text-[#0F172A] mb-1">No Google Spreadsheet Assigned</h3>
            <p className="text-sm text-[#64748B] max-w-md">
              No Google Spreadsheet has been assigned for this championship. Please contact the administrator.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center gap-2 min-w-0">
                <FileSpreadsheet size={16} className="text-[#64748B] shrink-0" />
                <span className="text-sm font-medium text-[#0F172A] truncate">{championshipName || 'Spreadsheet'}</span>
              </div>
              <button
                onClick={toggleFullscreen}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#64748B] hover:text-[#0F172A] hover:bg-white border border-transparent hover:border-gray-200 transition-all duration-200"
                title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
              >
                {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                <span className="hidden sm:inline">{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
              </button>
            </div>
            {loading && (
              <div className="flex flex-col items-center justify-center py-20 text-center px-6 animate-pulse">
                <div className="w-16 h-16 rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center mb-4">
                  <FileSpreadsheet size={28} className="text-gray-300" />
                </div>
                <div className="h-5 bg-gray-100 rounded w-48 mb-2" />
                <div className="h-4 bg-gray-50 rounded w-64" />
              </div>
            )}
            <iframe
              ref={iframeRef}
              src={embedUrl}
              title={`${championshipName || 'Spreadsheet'} - Google Sheets`}
              className={`w-full transition-opacity duration-300 ${
                isFullscreen
                  ? 'flex-1 h-full'
                  : 'h-150 lg:h-175'
              } ${loading ? 'opacity-0 absolute' : 'opacity-100'}`}
              onLoad={() => setLoading(false)}
              allowFullScreen
            />
          </>
        )}
      </div>
    </div>
  )
}
