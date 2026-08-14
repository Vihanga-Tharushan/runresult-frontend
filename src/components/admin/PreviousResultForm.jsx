import { useState, useRef, useMemo } from 'react'
import { motion } from 'framer-motion'
import { X, FileUp, Link as LinkIcon, Loader2, Trash2, FileText, Table } from 'lucide-react'
import toast from 'react-hot-toast'
import ConfirmDialog from './ConfirmDialog'
import mediaUpload from '../../utils/mediaUpload'

export default function PreviousResultForm({ previousResult, previousResults, onSave, onCancel, onDelete }) {
  const isEditing = !!previousResult
  const [uploading, setUploading] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const championOptions = useMemo(() => {
    const names = new Set((previousResults || []).map(r => r.championshipName).filter(Boolean))
    if (previousResult?.championshipName) names.add(previousResult.championshipName)
    return [...names].sort((a, b) => a.localeCompare(b))
  }, [previousResults, previousResult])

  const isKnownChampion = !!previousResult?.championshipName && championOptions.includes(previousResult.championshipName)

  const [form, setForm] = useState({
    championshipName: previousResult?.championshipName || '',
    venue: previousResult?.venue || '',
    year: previousResult?.year || '',
    description: previousResult?.description || '',
    resultType: previousResult?.resultType || '',
    fileUrl: previousResult?.fileUrl || '',
    driveLink: previousResult?.driveLink || '',
  })
  const [champMode, setChampMode] = useState(isKnownChampion ? 'existing' : 'new')

  const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }))

  const handleChampSelect = (value) => {
    if (value === '__new__') {
      setChampMode('new')
      update('championshipName', '')
    } else {
      setChampMode('existing')
      update('championshipName', value)
    }
  }

  const fileInputRef = useRef(null)

  const handleFileUpload = async (e) => {
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

    setUploading(true)
    try {
      const url = await mediaUpload(file)
      update('fileUrl', url)
      update('resultType', ext === '.pdf' ? 'pdf' : 'spreadsheet')
      toast.success('File uploaded successfully')
    } catch {
      toast.error('Failed to upload file')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const removeFile = () => {
    update('fileUrl', '')
    update('resultType', '')
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!form.championshipName || !form.venue || !form.year) {
      toast.error('Please fill in all required fields')
      return
    }

    if (!form.resultType) {
      toast.error('Please provide a result file or Google Drive link')
      return
    }

    if (form.resultType === 'drive' && !form.driveLink) {
      toast.error('Please enter a Google Drive link')
      return
    }

    if ((form.resultType === 'pdf' || form.resultType === 'spreadsheet') && !form.fileUrl) {
      toast.error('Please upload a file')
      return
    }

    onSave({
      ...previousResult,
      ...form,
      year: Number(form.year),
    })
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-8"
    >
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:p-8">
        <h2 className="text-lg font-bold text-[#0F172A] mb-6">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-[#0F172A] mb-1.5">Championship Name <span className="text-red-400">*</span></label>
            <select
              value={champMode === 'existing' ? form.championshipName : '__new__'}
              onChange={e => handleChampSelect(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-[#0F172A] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
            >
              <option value="" disabled>Select a championship...</option>
              {championOptions.map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
              <option value="__new__">+ New Championship</option>
            </select>
            {champMode === 'new' && (
              <input
                type="text"
                value={form.championshipName}
                onChange={e => update('championshipName', e.target.value)}
                placeholder="Enter new championship name..."
                className="w-full mt-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#0F172A] mb-1.5">Venue / Place <span className="text-red-400">*</span></label>
            <input type="text" value={form.venue} onChange={e => update('venue', e.target.value)} required
              placeholder="e.g. National Athletics Stadium"
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#0F172A] mb-1.5">Year <span className="text-red-400">*</span></label>
            <input type="number" value={form.year} onChange={e => update('year', e.target.value)} required
              placeholder="e.g. 2025" min="2000" max="2100"
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all" />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-[#0F172A] mb-1.5">Description</label>
            <textarea value={form.description} onChange={e => update('description', e.target.value)} rows={3}
              placeholder="Short description about the championship (optional)"
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all resize-none" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:p-8">
        <h2 className="text-lg font-bold text-[#0F172A] mb-2">Result File</h2>
        <p className="text-sm text-[#64748B] mb-6">Upload a PDF, spreadsheet, or provide a Google Drive link.</p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[#0F172A] mb-2">Upload File (PDF, XLSX, XLS, CSV)</label>
            {form.fileUrl ? (
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  {form.resultType === 'pdf' ? <FileText size={20} className="text-primary" /> : <Table size={20} className="text-primary" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#0F172A] truncate">
                    {form.resultType === 'pdf' ? 'PDF Document' : 'Spreadsheet Document'}
                  </p>
                  <p className="text-xs text-[#64748B] truncate">{form.fileUrl}</p>
                </div>
                <button type="button" onClick={removeFile}
                  className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors">
                  <X size={16} />
                </button>
              </div>
            ) : (
              <>
                <input ref={fileInputRef} type="file" accept=".pdf,.xlsx,.xls,.csv" onChange={handleFileUpload} className="hidden" disabled={uploading} />
                <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading}
                  className="w-full p-8 rounded-xl border-2 border-dashed border-gray-200 hover:border-primary/50 bg-gray-50/50 hover:bg-primary/5 flex flex-col items-center justify-center gap-3 transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed">
                  {uploading ? (
                    <Loader2 size={28} className="text-primary animate-spin" />
                  ) : (
                    <FileUp size={28} className="text-[#94A3B8] group-hover:text-primary transition-colors" />
                  )}
                  <div className="text-center">
                    <span className="text-sm font-medium text-[#64748B] group-hover:text-primary transition-colors">
                      {uploading ? 'Uploading...' : 'Click to upload file'}
                    </span>
                    <p className="text-xs text-[#94A3B8] mt-1">PDF, XLSX, XLS, or CSV</p>
                  </div>
                </button>
              </>
            )}
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white text-[#94A3B8]">OR</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#0F172A] mb-1.5">Google Drive Link</label>
            <div className="relative">
              <LinkIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
              <input type="url" value={form.driveLink} onChange={e => { update('driveLink', e.target.value); if (e.target.value) update('resultType', 'drive') }}
                placeholder="https://drive.google.com/file/d/..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div>
          {isEditing && onDelete && (
            <motion.button type="button" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowDeleteConfirm(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 text-sm font-semibold text-red-500 hover:bg-red-50 transition-all duration-200">
              <Trash2 size={16} /> Delete
            </motion.button>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button type="button" onClick={onCancel}
            className="px-6 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-[#64748B] hover:bg-gray-50 hover:text-[#0F172A] transition-all duration-200">
            Cancel
          </button>
          <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-all duration-200 shadow-sm">
            {isEditing ? 'Update Previous Result' : 'Create Previous Result'}
          </motion.button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => { onDelete?.(previousResult); setShowDeleteConfirm(false) }}
        title="Delete Previous Result"
        message={`Are you sure you want to delete "${previousResult?.championshipName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </motion.form>
  )
}
