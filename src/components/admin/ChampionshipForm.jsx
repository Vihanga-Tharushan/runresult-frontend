import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Upload, X, ImagePlus, Loader2, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import EventSelector from './EventSelector'
import ConfirmDialog from './ConfirmDialog'
import { districts } from '../../data/registration'
import mediaUpload from '../../utils/mediaUpload'

export default function ChampionshipForm({ championship, onSave, onCancel, onDelete }) {
  const isEditing = !!championship
  const [uploading, setUploading] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [form, setForm] = useState({
    name: championship?.name || '',
    description: championship?.description || '',
    organizer: championship?.organizer || '',
    venue: championship?.venue || '',
    district: championship?.district || '',
    startDate: championship?.startDate || '',
    endDate: championship?.endDate || '',
    regOpenDate: championship?.regOpenDate || '',
    regCloseDate: championship?.regCloseDate || '',
    selectedEvents: championship?.selectedEvents || [],
    banner: championship?.banner || '',
    logo: championship?.logo || '',
    bannerPreview: championship?.banner || '',
    logoPreview: championship?.logo || '',
  })

  const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      ...championship,
      ...form,
      athleteCount: championship?.athleteCount || 0,
      eventCount: form.selectedEvents.length,
    })
  }

  const bannerInputRef = useRef(null)
  const logoInputRef = useRef(null)

  const handleBannerUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await mediaUpload(file)
      update('banner', url)
      update('bannerPreview', url)
    } catch {
      toast.error('Failed to upload banner')
    } finally {
      setUploading(false)
    }
  }

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await mediaUpload(file)
      update('logo', url)
      update('logoPreview', url)
    } catch {
      toast.error('Failed to upload logo')
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (type) => {
    if (type === 'banner') {
      update('banner', '')
      update('bannerPreview', '')
    } else {
      update('logo', '')
      update('logoPreview', '')
    }
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
            <label className="block text-sm font-semibold text-[#0F172A] mb-1.5">Championship Name</label>
            <input type="text" value={form.name} onChange={e => update('name', e.target.value)} required
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all" />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-[#0F172A] mb-1.5">Organizer</label>
            <input type="text" value={form.organizer} onChange={e => update('organizer', e.target.value)} required
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all" />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-[#0F172A] mb-1.5">Venue</label>
            <input type="text" value={form.venue} onChange={e => update('venue', e.target.value)} required
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#0F172A] mb-1.5">District</label>
            <select value={form.district} onChange={e => update('district', e.target.value)} required
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-[#0F172A] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all">
              <option value="">Select district</option>
              {districts.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-[#0F172A] mb-1.5">Description</label>
            <textarea value={form.description} onChange={e => update('description', e.target.value)} rows={3}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all resize-none" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:p-8">
        <h2 className="text-lg font-bold text-[#0F172A] mb-6">Dates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-[#0F172A] mb-1.5">Start Date</label>
            <input type="date" value={form.startDate} onChange={e => update('startDate', e.target.value)} required
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-[#0F172A] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#0F172A] mb-1.5">End Date</label>
            <input type="date" value={form.endDate} onChange={e => update('endDate', e.target.value)} required
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-[#0F172A] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#0F172A] mb-1.5">Registration Opening Date</label>
            <input type="date" value={form.regOpenDate} onChange={e => update('regOpenDate', e.target.value)} required
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-[#0F172A] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#0F172A] mb-1.5">Registration Closing Date</label>
            <input type="date" value={form.regCloseDate} onChange={e => update('regCloseDate', e.target.value)} required
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-[#0F172A] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:p-8">
        <h2 className="text-lg font-bold text-[#0F172A] mb-6">Media</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-[#0F172A] mb-2">Championship Banner</label>
            {form.bannerPreview ? (
              <div className="relative rounded-xl overflow-hidden border border-gray-200">
                <img src={form.bannerPreview} alt="Banner preview" className="w-full h-40 object-cover" />
                <button type="button" onClick={() => removeImage('banner')}
                  className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-lg hover:bg-white text-red-500 transition-colors shadow-sm">
                  <X size={14} />
                </button>
              </div>
            ) : (
              <>
                <input ref={bannerInputRef} type="file" accept="image/*" onChange={handleBannerUpload} className="hidden" disabled={uploading} />
                <button type="button" onClick={() => bannerInputRef.current?.click()} disabled={uploading}
                  className="w-full h-40 rounded-xl border-2 border-dashed border-gray-200 hover:border-primary/50 bg-gray-50/50 hover:bg-primary/5 flex flex-col items-center justify-center gap-2 transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed">
                  {uploading ? (
                    <Loader2 size={24} className="text-primary animate-spin" />
                  ) : (
                    <ImagePlus size={24} className="text-[#94A3B8] group-hover:text-primary transition-colors" />
                  )}
                  <span className="text-sm font-medium text-[#64748B] group-hover:text-primary transition-colors">
                    {uploading ? 'Uploading...' : 'Upload Banner Image'}
                  </span>
                </button>
              </>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#0F172A] mb-2">Championship Logo</label>
            {form.logoPreview ? (
              <div className="relative rounded-xl overflow-hidden border border-gray-200">
                <img src={form.logoPreview} alt="Logo preview" className="w-full h-40 object-contain bg-gray-50" />
                <button type="button" onClick={() => removeImage('logo')}
                  className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-lg hover:bg-white text-red-500 transition-colors shadow-sm">
                  <X size={14} />
                </button>
              </div>
            ) : (
              <>
                <input ref={logoInputRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" disabled={uploading} />
                <button type="button" onClick={() => logoInputRef.current?.click()} disabled={uploading}
                  className="w-full h-40 rounded-xl border-2 border-dashed border-gray-200 hover:border-primary/50 bg-gray-50/50 hover:bg-primary/5 flex flex-col items-center justify-center gap-2 transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed">
                  {uploading ? (
                    <Loader2 size={24} className="text-primary animate-spin" />
                  ) : (
                    <ImagePlus size={24} className="text-[#94A3B8] group-hover:text-primary transition-colors" />
                  )}
                  <span className="text-sm font-medium text-[#64748B] group-hover:text-primary transition-colors">
                    {uploading ? 'Uploading...' : 'Upload Logo Image'}
                  </span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-[#0F172A]">Championship Events</h2>
        </div>
        <EventSelector selectedEvents={form.selectedEvents} onChange={(events) => update('selectedEvents', events)} />
      </div>

      <div className="flex items-center justify-between gap-3">
        <div>
          {isEditing && onDelete && (
            <motion.button type="button" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowDeleteConfirm(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 text-sm font-semibold text-red-500 hover:bg-red-50 transition-all duration-200">
              <Trash2 size={16} /> Delete Championship
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
            {isEditing ? 'Update Championship' : 'Create Championship'}
          </motion.button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => { onDelete?.(championship); setShowDeleteConfirm(false) }}
        title="Delete Championship"
        message={`Are you sure you want to delete "${championship?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </motion.form>
  )
}
