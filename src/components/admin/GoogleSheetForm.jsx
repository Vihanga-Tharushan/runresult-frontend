import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Save, Eye, EyeOff, FileUp, Loader2, X, FileText, Table } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'
import SheetStatusCard from './SheetStatusCard'
import EmptyState from './EmptyState'
import mediaUpload from '../../utils/mediaUpload'

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
  { key: 'points', label: 'Points Sheet' },
  { key: 'medals', label: 'Medals Sheet' },
  { key: 'records', label: 'Records Sheet' },
  { key: 'trophies', label: 'Trophies Sheet' },
]

const defaultSheets = {
  registration: { url: '', connected: false },
  startList: { url: '', connected: false },
  heatResults: { url: '', connected: false },
  finalResults: { url: '', connected: false },
  points: { url: '', connected: false },
  medals: { url: '', connected: false },
  records: { url: '', connected: false, type: 'pdf' },
  trophies: { url: '', connected: false, type: 'pdf' },
}

const formatOptions = [
  { value: 'normal', label: 'Normal' },
  { value: 'withoutZone', label: 'Without Zone' },
  { value: 'army', label: 'Army' },
]

const fileTypeOptions = [
  { value: 'pdf', label: 'PDF' },
  { value: 'spreadsheet', label: 'Spreadsheet' },
  { value: 'drive', label: 'Google Drive' },
]

export default function GoogleSheetForm() {
  const [championships, setChampionships] = useState([])
  const [selectedChamp, setSelectedChamp] = useState(null)
  const [sheets, setSheets] = useState(defaultSheets)
  const [finalResultsFormat, setFinalResultsFormat] = useState('normal')
  const [previewKey, setPreviewKey] = useState(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState({ records: false, trophies: false })
  const fileInputRefs = {
    records: useRef(null),
    trophies: useRef(null),
  }

  useEffect(() => {
    axios.get(API + '/api/championships', { headers: authHeaders() })
      .then(res => setChampionships(res.data.championships))
      .catch(() => {})
  }, [])

  const handleSelectChamp = (id) => {
    const champ = championships.find(c => c._id === id)
    setSelectedChamp(champ)
    setSheets({ ...defaultSheets, ...(champ?.googleSheets || {}) })
    setFinalResultsFormat(champ?.finalResultsFormat || 'normal')
    setPreviewKey(null)
  }

  const updateSheet = (key, value) => {
    setSheets(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        ...value,
        connected: 'url' in value ? !!value.url : !!prev[key]?.url,
      },
    }))
  }

  const handleFileUpload = async (key, e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv',
    ]
    const allowedExtensions = ['.pdf', '.xlsx', '.xls', '.csv']
    const ext = '.' + file.name.split('.').pop().toLowerCase()

    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(ext)) {
      toast.error('Only PDF, XLSX, XLS, and CSV files are allowed')
      return
    }

    setUploading(prev => ({ ...prev, [key]: true }))
    try {
      const url = await mediaUpload(file)
      updateSheet(key, {
        url,
        connected: true,
        type: ext === '.pdf' ? 'pdf' : 'spreadsheet',
      })
      toast.success('File uploaded successfully')
    } catch (err) {
      toast.error(err?.message || 'Failed to upload file')
    } finally {
      setUploading(prev => ({ ...prev, [key]: false }))
      if (fileInputRefs[key]?.current) fileInputRefs[key].current.value = ''
    }
  }

  const removeFile = (key) => {
    updateSheet(key, { url: '', connected: false })
  }

  const handleSave = () => {
    setSaving(true)
    axios.put(API + `/api/championships/${selectedChamp._id}`, { googleSheets: sheets, finalResultsFormat }, { headers: authHeaders() })
      .then(res => {
        const updated = res.data.championship
        if (!updated) {
          throw new Error(res.data?.message || 'Server did not return the updated championship')
        }
        setChampionships(prev => prev.map(c => c._id === updated._id ? updated : c))
        setSelectedChamp(updated)
        toast.success('Sheet URLs saved successfully!')
      })
      .catch(err => toast.error(err?.response?.data?.message || err?.message || 'Failed to save sheet URLs'))
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
                {key === 'records' || key === 'trophies' ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-sm font-bold text-[#0F172A]">{label}</h4>
                      {sheets[key]?.connected && sheets[key]?.url ? (
                        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200">
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor"><circle cx="5" cy="5" r="5" /></svg>
                          <span>Connected</span>
                        </motion.span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-500 border border-red-200">
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor"><circle cx="5" cy="5" r="5" /></svg>
                          <span>Not Connected</span>
                        </span>
                      )}
                    </div>

                    {sheets[key]?.url ? (
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          {sheets[key]?.type === 'pdf' ? <FileText size={20} className="text-primary" /> : <Table size={20} className="text-primary" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[#0F172A] truncate">
                            {sheets[key]?.type === 'pdf' ? 'PDF Document' : 'Spreadsheet Document'}
                          </p>
                          <p className="text-xs text-[#64748B] truncate">{sheets[key].url}</p>
                        </div>
                        <button type="button" onClick={() => removeFile(key)}
                          className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors">
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <input ref={fileInputRefs[key]} type="file" accept=".pdf,.xlsx,.xls,.csv" onChange={(e) => handleFileUpload(key, e)} className="hidden" disabled={uploading[key]} />
                        <button type="button" onClick={() => fileInputRefs[key].current?.click()} disabled={uploading[key]}
                          className="w-full p-6 rounded-xl border-2 border-dashed border-gray-200 hover:border-primary/50 bg-gray-50/50 hover:bg-primary/5 flex flex-col items-center justify-center gap-3 transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed">
                          {uploading[key] ? (
                            <Loader2 size={24} className="text-primary animate-spin" />
                          ) : (
                            <FileUp size={24} className="text-[#94A3B8] group-hover:text-primary transition-colors" />
                          )}
                          <div className="text-center">
                            <span className="text-sm font-medium text-[#64748B] group-hover:text-primary transition-colors">
                              {uploading[key] ? 'Uploading...' : 'Click to upload PDF or Spreadsheet'}
                            </span>
                            <p className="text-xs text-[#94A3B8] mt-1">PDF, XLSX, XLS, or CSV</p>
                          </div>
                        </button>
                        <div className="relative">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200" />
                          </div>
                          <div className="relative flex justify-center text-xs">
                            <span className="px-3 bg-white text-[#94A3B8]">OR</span>
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-[#64748B] mb-1.5">Enter URL (PDF, Google Sheet, or Google Drive)</label>
                          <input
                            type="url"
                            value={sheets[key]?.url || ''}
                            onChange={e => updateSheet(key, { url: e.target.value, connected: !!e.target.value, type: sheets[key]?.type || (key === 'records' || key === 'trophies' ? 'pdf' : 'sheet') })}
                            placeholder="https://..."
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                          />
                        </div>
                      </div>
                    )}

                    {sheets[key]?.url && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-sm font-semibold text-[#0F172A] mb-3">File Type</p>
                        <div className="flex flex-wrap gap-4">
                          {fileTypeOptions.map(({ value, label: optLabel }) => (
                            <label key={value} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name={`${key}Type`}
                                value={value}
                                checked={sheets[key]?.type === value}
                                onChange={() => updateSheet(key, { type: value })}
                                className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                              />
                              <span className="text-sm text-[#64748B]">{optLabel}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <SheetStatusCard label={label} sheet={sheets[key]} onUpdate={(val) => updateSheet(key, val)} />
                    {key === 'finalResults' && sheets[key]?.connected && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-sm font-semibold text-[#0F172A] mb-3">Results Format</p>
                        <div className="flex flex-wrap gap-4">
                          {formatOptions.map(({ value, label: optLabel }) => (
                            <label key={value} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name="finalResultsFormat"
                                value={value}
                                checked={finalResultsFormat === value}
                                onChange={() => setFinalResultsFormat(value)}
                                className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                              />
                              <span className="text-sm text-[#64748B]">{optLabel}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
               {sheets[key]?.url && (
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
                         {(key === 'records' || key === 'trophies') && sheets[key]?.type === 'pdf' ? (
                           <iframe
                             src={`${sheets[key].url}#view=FitH&toolbar=0`}
                             title={`${label} Preview`}
                             className="w-full h-87.5 lg:h-112.5 bg-gray-50"
                             allowFullScreen
                           />
                         ) : (key === 'records' || key === 'trophies') && sheets[key]?.type === 'spreadsheet' ? (
                           <iframe
                             src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(sheets[key].url)}`}
                             title={`${label} Preview`}
                             className="w-full h-87.5 lg:h-112.5 bg-gray-50"
                             allowFullScreen
                           />
                         ) : (key === 'records' || key === 'trophies') && sheets[key]?.type === 'drive' ? (
                           (() => {
                             const driveMatch = sheets[key].url.match(/\/d\/([a-zA-Z0-9_-]+)/)
                             const driveEmbed = driveMatch ? `https://drive.google.com/file/d/${driveMatch[1]}/preview` : null
                             return driveEmbed ? (
                               <iframe
                                 src={driveEmbed}
                                 title={`${label} Preview`}
                                 className="w-full h-87.5 lg:h-112.5 bg-gray-50"
                                 allowFullScreen
                               />
                             ) : (
                               <div className="p-4 text-sm text-[#64748B] text-center">Invalid Google Drive link</div>
                             )
                           })()
                         ) : embedUrl ? (
                           <iframe
                             src={embedUrl}
                             title={`${label} Preview`}
                             className="w-full h-87.5 lg:h-112.5 bg-gray-50"
                             allowFullScreen
                           />
                         ) : (
                           <div className="p-4 text-sm text-[#64748B] text-center">Preview not available for this file type</div>
                         )}
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
