import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Save, ExternalLink, CheckCircle, AlertTriangle } from 'lucide-react'
import EmptyState from './EmptyState'

const mockChampionships = [
  { id: 'ac-1', name: 'National Athletics Championships 2026' },
  { id: 'ac-2', name: 'International Track & Field Series' },
  { id: 'ac-3', name: 'Asian Athletics Grand Prix' },
  { id: 'ac-4', name: 'World Junior Athletics Championships' },
  { id: 'ac-5', name: 'Regional Athletics Meet 2026' },
]

function extractSheetId(url) {
  if (!url) return null
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/)
  return match ? match[1] : null
}

function getEmbedUrl(url) {
  const id = extractSheetId(url)
  if (!id) return null
  return `https://docs.google.com/spreadsheets/d/${id}/preview`
}

export default function CertificatePreview() {
  const [selectedChamp, setSelectedChamp] = useState(null)
  const [sheetUrl, setSheetUrl] = useState('')
  const [toast, setToast] = useState(null)

  const embedUrl = useMemo(() => getEmbedUrl(sheetUrl), [sheetUrl])
  const isValidSheet = !!extractSheetId(sheetUrl)

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const handleSave = () => {
    showToast('Certificate sheet URL saved successfully!')
  }

  if (!selectedChamp) {
    return (
      <div className="space-y-4">
        <label className="block text-sm font-semibold text-[#0F172A] mb-1.5">Select Championship</label>
        <select onChange={e => {
          const champ = mockChampionships.find(c => c.id === e.target.value)
          setSelectedChamp(champ)
        }} value=""
          className="w-full max-w-md px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-[#0F172A] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all">
          <option value="">Choose a championship...</option>
          {mockChampionships.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <EmptyState icon="inbox" title="Select a Championship" description="Choose a championship above to configure certificate printing." />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-[#0F172A]">{selectedChamp.name}</h3>
          <p className="text-sm text-[#64748B]">Configure certificate data source and preview</p>
        </div>
        <button onClick={() => setSelectedChamp(null)}
          className="text-sm text-[#64748B] hover:text-[#0F172A] transition-colors">Change</button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:p-8">
        <h4 className="text-base font-bold text-[#0F172A] mb-4">Certificate Data Source</h4>
        <p className="text-sm text-[#64748B] mb-4">Link a Google Sheet containing certificate data for this championship.</p>
        <div className="max-w-xl">
          <label className="block text-sm font-semibold text-[#0F172A] mb-1.5">Certificate Google Sheet URL</label>
          <div className="flex gap-3">
            <input type="url" value={sheetUrl} onChange={e => setSheetUrl(e.target.value)}
              placeholder="https://docs.google.com/spreadsheets/d/..."
              className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all" />
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSave}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-all shadow-sm whitespace-nowrap">
              <Save size={16} /> Save
            </motion.button>
          </div>
        </div>
      </div>

      {sheetUrl && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h4 className="text-base font-bold text-[#0F172A]">Spreadsheet Preview</h4>
            <a href={sheetUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline">
              <ExternalLink size={14} /> Open in Google Sheets
            </a>
          </div>
          <div className="bg-gray-50">
            {!isValidSheet ? (
              <div className="flex flex-col items-center justify-center py-16 text-center px-6">
                <AlertTriangle size={32} className="text-amber-400 mb-3" />
                <p className="text-sm font-semibold text-[#0F172A]">Invalid Google Sheet URL</p>
                <p className="text-xs text-[#64748B] mt-1">Please enter a valid Google Sheets URL containing /d/SPREADSHEET_ID</p>
              </div>
            ) : (
              <iframe
                src={embedUrl}
                title="Google Sheet Preview"
                className="w-full h-[400px] lg:h-[500px]"
                allowFullScreen
              />
            )}
          </div>
        </motion.div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:p-8">
        <h4 className="text-base font-bold text-[#0F172A] mb-4">Certificate Options</h4>
        <p className="text-sm text-[#64748B] mb-4">Additional certificate options will be available in future updates.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {['Participation', 'Merit', 'Gold', 'Record'].map((type) => (
            <div key={type} className="p-4 rounded-xl border border-dashed border-gray-200 bg-gray-50/50 text-center">
              <p className="text-sm font-semibold text-[#64748B]">{type}</p>
              <p className="text-xs text-[#94A3B8] mt-1">Coming soon</p>
            </div>
          ))}
        </div>
      </div>

      {toast && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-sm font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle size={18} /> {toast}
        </motion.div>
      )}
    </div>
  )
}
