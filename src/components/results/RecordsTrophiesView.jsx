import { motion } from 'framer-motion'
import { FileText, Table, Link as LinkIcon, ExternalLink } from 'lucide-react'
import { buildDocumentEmbedUrl, detectDocumentType } from '../../utils/documentPreview'

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

  const type = detectDocumentType(data.url, data.type || 'sheet')
  const TypeIcon = typeConfig[type]?.icon || FileText
  const embedUrl = buildDocumentEmbedUrl(data.url, type)

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
        {embedUrl ? (
          <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
            <iframe
              src={embedUrl}
              className="w-full h-[60vh] md:h-[75vh] lg:h-[95vh]"
              title={`${title} Preview`}
              allowFullScreen
            />
          </div>
        ) : (
          <div className="py-10 text-center">
            <p className="text-sm text-[#64748B] mb-4">This document cannot be embedded.</p>
            <a
              href={data.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-all duration-200"
            >
              <ExternalLink size={16} /> Open Document
            </a>
          </div>
        )}

        {type === 'drive' && (
          <div className="mt-4">
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
