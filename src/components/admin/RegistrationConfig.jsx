import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Globe, Lock, CheckCircle, Table, AlertTriangle } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'
import PricingTable from './PricingTable'
import ConfirmDialog from './ConfirmDialog'
import EmptyState from './EmptyState'
import StatusBadge from './StatusBadge'

const API = import.meta.env.VITE_API_URL

function authHeaders() {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export default function RegistrationConfig() {
  const [championships, setChampionships] = useState([])
  const [selectedChamp, setSelectedChamp] = useState(null)
  const [maxEvents, setMaxEvents] = useState(3)
  const [pricing, setPricing] = useState([{ events: 1, fee: 0 }])
  const [saving, setSaving] = useState(false)
  const [showPublishDialog, setShowPublishDialog] = useState(false)
  const [showCloseDialog, setShowCloseDialog] = useState(false)

  useEffect(() => {
    axios.get(API + '/api/championships', { headers: authHeaders() })
      .then(res => setChampionships(res.data.championships))
      .catch(() => {})
  }, [])

  const isPublished = selectedChamp?.registrationStatus === 'open'

  const registrationSheet = selectedChamp?.googleSheets?.registration
  const hasRegistrationSheet = !!(registrationSheet?.url && registrationSheet?.connected)

  function selectChamp(id) {
    const champ = championships.find(c => c._id === id)
    setSelectedChamp(champ)
    setMaxEvents(champ?.maxEventsPerAthlete || 3)
    setPricing(champ?.pricing?.length ? champ.pricing : [{ events: 1, fee: 0 }])
  }

  function updateChamp(data, successMsg) {
    setSaving(true)
    axios.put(API + `/api/championships/${selectedChamp._id}`, data, { headers: authHeaders() })
      .then(res => {
        const updated = res.data.championship
        setChampionships(prev => prev.map(c => c._id === updated._id ? updated : c))
        setSelectedChamp(updated)
        toast.success(successMsg)
      })
      .catch(() => toast.error('Failed to update championship'))
      .finally(() => setSaving(false))
  }

  const handlePublishClick = () => {
    if (!hasRegistrationSheet) {
      toast.error('Connect the Registration Sheet before publishing registration')
      return
    }
    setShowPublishDialog(true)
  }

  const handlePublish = () => {
    updateChamp({
      maxEventsPerAthlete: maxEvents,
      pricing,
      registrationStatus: 'open',
      publishStatus: 'published',
    }, 'Registration published successfully! Championship is now visible on Athlete Portal.')
  }

  const handleClose = () => {
    updateChamp({
      registrationStatus: 'closed',
      publishStatus: 'closed',
    }, 'Registration closed. Athletes can no longer register.')
  }

  const handleSave = () => {
    updateChamp({
      maxEventsPerAthlete: maxEvents,
      pricing,
    }, 'Registration configuration saved successfully!')
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
        <EmptyState icon="file" title="Select a Championship" description="Choose a championship above to configure its registration settings." />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-[#0F172A]">{selectedChamp.name}</h3>
          <StatusBadge status={selectedChamp.registrationStatus} />
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setSelectedChamp(null)}
            className="text-sm text-[#64748B] hover:text-[#0F172A] transition-colors">Change</button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:p-8">
        <h4 className="text-base font-bold text-[#0F172A] mb-4">Registration Rules</h4>
        <div className="max-w-xs">
          <label className="block text-sm font-semibold text-[#0F172A] mb-1.5">Maximum Events Per Athlete</label>
          <input type="number" value={maxEvents} onChange={e => setMaxEvents(Number(e.target.value))} min={1} max={10}
            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-[#0F172A] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all" />
          <p className="text-xs text-[#64748B] mt-1">Determines how many events an athlete can register for.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:p-8">
        <h4 className="text-base font-bold text-[#0F172A] mb-4">Registration Fee Configuration</h4>
        <p className="text-sm text-[#64748B] mb-4">Define pricing rules based on number of events.</p>
        <PricingTable pricing={pricing} onChange={setPricing} />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:p-8">
        <h4 className="text-base font-bold text-[#0F172A] mb-4">Registration Controls</h4>

        {!hasRegistrationSheet && (
          <div className="mb-4 p-4 rounded-xl border border-amber-200 bg-amber-50">
            <div className="flex items-start gap-3">
              <AlertTriangle size={18} className="text-amber-500 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-amber-800">
                  Registration Sheet not connected
                </p>
                <p className="text-sm text-amber-700 mt-1">
                  A Google Sheets Registration Sheet must be connected before you can publish registration.
                  Registration data is synced to this sheet.
                </p>
                <Link
                  to="/admin/google-sheets"
                  className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 hover:text-amber-900 underline underline-offset-2"
                >
                  <Table size={14} /> Connect Registration Sheet
                </Link>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-4">
          {isPublished ? (
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}
              onClick={() => setShowCloseDialog(true)} disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition-all shadow-sm disabled:opacity-50">
              <Lock size={18} /> Close Registration
            </motion.button>
          ) : (
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}
              onClick={handlePublishClick} disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 text-white text-sm font-bold hover:bg-emerald-600 transition-all shadow-sm disabled:opacity-50">
              <Globe size={18} /> Publish Registration
            </motion.button>
          )}
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}
            onClick={handleSave} disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary-dark transition-all shadow-sm disabled:opacity-50">
            <CheckCircle size={18} /> Save Configuration
          </motion.button>
        </div>
      </div>

      <ConfirmDialog isOpen={showPublishDialog} onClose={() => setShowPublishDialog(false)} onConfirm={handlePublish}
        title="Publish Registration?" message="This will make the championship immediately visible on the Athlete Portal. Athletes will be able to register."
        confirmText="Publish" cancelText="Cancel" variant="default" />
      <ConfirmDialog isOpen={showCloseDialog} onClose={() => setShowCloseDialog(false)} onConfirm={handleClose}
        title="Close Registration?" message="Registration will be closed immediately. Athletes will no longer be able to register for this championship."
        confirmText="Close Registration" cancelText="Cancel" variant="danger" />
    </div>
  )
}
