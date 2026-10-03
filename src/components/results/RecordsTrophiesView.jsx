import { motion } from 'framer-motion'
import { FileText, Table, Link as LinkIcon, ExternalLink } from 'lucide-react'

const typeConfig = {
  pdf: { label: 'PDF', color: 'bg-red-50 text-red-600 border-red-100', icon: FileText },
  spreadsheet: { label: 'Spreadsheet', color: 'bg-green-50 text-green-600 border-green-100', icon: Table },
  sheet: { label: 'Spreadsheet', color: 'bg-green-50 text-green-600 border-green-100', icon: Table },
  drive: { label: 'Google Drive', color: 'bg-blue-50 text-blue-600 border-blue-100', icon: LinkIcon },
}

export default function RecordsTrophiesView({ data, loading, title }) {
  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-100 rounded w-1/4" />
        <div className="h-64 bg-gray-100 rounded-2xl" />
      </div>
    )
  }

  if (!data || !data.exists || !data.url) {
    return (
      <div className="text-center py-16">
        <p className="text-sm text-[#64748B]">{title} data is not available for this championship.</p>
      </div>
    )
  }

  const type = data.type || 'sheet'
  const TypeIcon = typeConfig[type]?.icon || FileText

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
    >
      <div className="p-4 lg:p-6 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-lg font-bold text-[#0F172A]">{title}</h2>
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 ${typeConfig[type]?.color || typeConfig.sheet.color}`}>
          <TypeIcon size={14} />
          <span>{typeConfig[type]?.label || 'Document'}</span>
        </div>
      </div>

      <div className="p-4 lg:p-6">
        {type === 'pdf' && (
          <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
            <iframe
              src={`${data.url}#view=FitH&toolbar=0`}
              className="w-full h-[60vh] md:h-[75vh] lg:h-[95vh]"
              title={`${title} Preview`}
              allowFullScreen
            />
          </div>
        )}

        {(type === 'spreadsheet' || type === 'sheet') && (
          <div className="rounded-xl border border-gray-200 overflow-hidden bg-gray-50">
            {(() => {
              const id = data.url.match(/\/d\/([a-zA-Z0-9_-]+)/)
              const embedUrl = id ? `https://docs.google.com/spreadsheets/d/${id[1]}/preview?rm=minimal&chrome=false&toolbar=0&showNav=0&showSheetTabs=0` : null
              return embedUrl ? (
                <iframe
                  src={embedUrl}
                  className="w-full h-[60vh] md:h-[75vh] lg:h-[95vh]"
                  title={`${title} Preview`}
                  allowFullScreen
                />
              ) : (
                <iframe
                  src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(data.url)}`}
                  className="w-full h-[60vh] md:h-[75vh] lg:h-[95vh]"
                  title={`${title} Preview`}
                  allowFullScreen
                />
              )
            })()}
          </div>
        )}

        {type === 'drive' && (
          <div className="space-y-4">
            {(() => {
              const driveMatch = data.url.match(/\/d\/([a-zA-Z0-9_-]+)/)
              if (driveMatch) {
                const embedUrl = `https://drive.google.com/file/d/${driveMatch[1]}/preview`
                return (
                  <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                    <iframe
                      src={embedUrl}
                      className="w-full h-[60vh] md:h-[75vh] lg:h-[85vh]"
                      title={`${title} Preview`}
                      allowFullScreen
                    />
                  </div>
                )
              }
              return null
            })()}
            <a
              href={data.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-all duration-200"
            >
              <ExternalLink size={16} /> Open in Google Drive
            </a>
          </div>
        )}
      </div>
    </motion.div>
  )
}
