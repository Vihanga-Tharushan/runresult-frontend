import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Save, Eye, EyeOff } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'
import SheetStatusCard from './SheetStatusCard'
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

const sheetTypes = [
  { key: 'registration', label: 'Registration Sheet' },
  { key: 'startList', label: 'Start List Sheet' },
  { key: 'heatResults', label: 'Heat Results Sheet' },
  { key: 'finalResults', label: 'Final Results Sheet' },
]

const defaultSheets = {
  registration: { url: '', connected: false },
  startList: { url: '', connected: false },
  heatResults: { url: '', connected: false },
  finalResults: { url: '', connected: false },
}

export default function GoogleSheetForm() {
  const [championships, setChampionships] = useState([])
  const [selectedChamp, setSelectedChamp] = useState(null)
  const [sheets, setSheets] = useState(defaultSheets)
  const [previewKey, setPreviewKey] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    axios.get(API + '/api/championships', { headers: authHeaders() })
      .then(res => setChampionships(res.data.championships))
      .catch(() => {})
  }, [])

  const handleSelectChamp = (id) => {
    const champ = championships.find(c => c._id === id)
    setSelectedChamp(champ)
    setSheets(champ?.googleSheets || defaultSheets)
    setPreviewKey(null)
  }

  const updateSheet = (key, value) => {
    setSheets(prev => ({
      ...prev,
      [key]: { ...value, connected: !!value.url },
    }))
  }

  const handleSave = () => {
    setSaving(true)
    axios.put(API + `/api/championships/${selectedChamp._id}`, { googleSheets: sheets }, { headers: authHeaders() })
      .then(res => {
        const updated = res.data.championship
        setChampionships(prev => prev.map(c => c._id === updated._id ? updated : c))
        setSelectedChamp(updated)
        toast.success('Sheet URLs saved successfully!')
      })
      .catch(() => toast.error('Failed to save sheet URLs'))
      .finally(() => setSaving(false))
  }

  if (!selectedChamp) {
    return (
      <div className="space-y-4">
        <label className="block text-sm font-semibold text-[#0F172A] mb-1.5">Select Championship</label>
        <select onChange={e => handleSelectChamp(e.target.value)} value=""
          className="w-full max-w-md px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-[#0F172A] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all">
          <option value="">Choose a championship...</option>
          {championships.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
        <EmptyState icon="table" title="Select a Championship" description="Choose a championship above to configure its Google Sheet integrations." />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-[#0F172A]">{selectedChamp.name}</h3>
          <p className="text-sm text-[#64748B]">Configure Google Sheet URLs for data synchronization</p>
        </div>
        <button onClick={() => setSelectedChamp(null)}
          className="text-sm text-[#64748B] hover:text-[#0F172A] transition-colors">Change</button>
      </div>

      <div className="space-y-4">
        {sheetTypes.map(({ key, label }) => {
          const embedUrl = getEmbedUrl(sheets[key]?.url)
          const isPreviewing = previewKey === key
          return (
            <div key={key} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-4 lg:p-5">
                <SheetStatusCard label={label} sheet={sheets[key]} onUpdate={(val) => updateSheet(key, val)} />
              </div>
              {sheets[key]?.url && embedUrl && (
                <div className="border-t border-gray-100">
                  <button
                    onClick={() => setPreviewKey(isPreviewing ? null : key)}
                    className="flex items-center gap-2 w-full px-5 py-3 text-xs font-semibold text-[#64748B] hover:text-primary hover:bg-gray-50/50 transition-colors"
                  >
                    {isPreviewing ? <EyeOff size={14} /> : <Eye size={14} />}
                    {isPreviewing ? 'Hide Preview' : 'Show Preview'}
                  </button>
                  <AnimatePresence>
                    {isPreviewing && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-gray-100"
                      >
                        <iframe
                          src={embedUrl}
                          title={`${label} Preview`}
                          className="w-full h-87.5 lg:h-112.5 bg-gray-50"
                          allowFullScreen
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="flex justify-end">
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSave} disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-all shadow-sm disabled:opacity-50">
          <Save size={16} /> {saving ? 'Saving...' : 'Save All Sheets'}
        </motion.button>
      </div>
    </div>
  )
}
