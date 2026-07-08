import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Link as LinkIcon } from 'lucide-react'

export default function SheetStatusCard({ label, sheet, onUpdate }) {
  const isConnected = sheet?.connected && sheet?.url

  return (
    <div className={`bg-white rounded-xl border p-4 lg:p-5 transition-all duration-200 hover:shadow-sm ${
      isConnected ? 'border-emerald-200 bg-emerald-50/30' : 'border-gray-200'
    }`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="text-sm font-bold text-[#0F172A]">{label}</h4>
            {isConnected ? (
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200">
                <CheckCircle size={10} /> Connected
              </motion.span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-500 border border-red-200">
                <XCircle size={10} /> Not Connected
              </span>
            )}
          </div>
          <input type="url" value={sheet?.url || ''} onChange={e => onUpdate({ ...sheet, url: e.target.value })}
            placeholder="Google Sheet URL"
            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all" />
        </div>
      </div>
      {sheet?.url && (
        <div className="mt-2 flex items-center gap-1.5">
          <LinkIcon size={12} className="text-[#64748B]" />
          <a href={sheet.url} target="_blank" rel="noopener noreferrer"
            className="text-xs text-primary hover:underline truncate">Open sheet</a>
        </div>
      )}
    </div>
  )
}
