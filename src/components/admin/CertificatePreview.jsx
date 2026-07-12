import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Save, ExternalLink, AlertTriangle } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'
import EmptyState from './EmptyState'

const API = import.meta.env.VITE_API_URL

function authHeaders() {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

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
  const [championships, setChampionships] = useState([])
  const [selectedChamp, setSelectedChamp] = useState(null)
  const [sheetUrl, setSheetUrl] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    axios.get(API + '/api/championships', { headers: authHeaders() })
      .then(res => setChampionships(res.data.championships))
      .catch(() => {})
  }, [])

  const embedUrl = useMemo(() => getEmbedUrl(sheetUrl), [sheetUrl])
  const isValidSheet = !!extractSheetId(sheetUrl)

  function selectChamp(id) {
    const champ = championships.find(c => c._id === id)
    setSelectedChamp(champ)
    setSheetUrl(champ?.googleSheets?.certificate?.url || '')
  }

  const handleSave = () => {
    setSaving(true)
    axios.put(API + `/api/championships/${selectedChamp._id}`, {
      googleSheets: {
        ...selectedChamp.googleSheets,
        certificate: { url: sheetUrl, connected: !!sheetUrl },
      },
    }, { headers: authHeaders() })
      .then(res => {
        const updated = res.data.championship
        setChampionships(prev => prev.map(c => c._id === updated._id ? updated : c))
        setSelectedChamp(updated)
        toast.success('Certificate sheet URL saved successfully!')
      })
      .catch(() => toast.error('Failed to save certificate sheet URL'))
      .finally(() => setSaving(false))
  }

  if (!selectedChamp) {
    return (
      <div className="space-y-4">
        <label className="block text-sm font-semibold text-[#0F172A] mb-1.5">Select Championship</label>
        <select onChange={e => selectChamp(e.target.value)} value=""
          className="w-full max-w-md px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-[#0F172A] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all">
          <option value="">Choose a championship...</option>
          {championships.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
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
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSave} disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-all shadow-sm whitespace-nowrap disabled:opacity-50">
              <Save size={16} /> {saving ? 'Saving...' : 'Save'}
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
                className="w-full h-100 lg:h-125"
                allowFullScreen
              />
            )}
          </div>
        </motion.div>
      )}


    </div>
  )
}
