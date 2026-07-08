import { useState } from 'react'
import { motion } from 'framer-motion'
import { Globe, Lock, CheckCircle, AlertTriangle } from 'lucide-react'
import PricingTable from './PricingTable'
import ConfirmDialog from './ConfirmDialog'
import EmptyState from './EmptyState'
import StatusBadge from './StatusBadge'

const mockChampionships = [
  { id: 'ac-1', name: 'National Athletics Championships 2026', regStatus: 'open' },
  { id: 'ac-2', name: 'International Track & Field Series', regStatus: 'open' },
  { id: 'ac-3', name: 'Asian Athletics Grand Prix', regStatus: 'open' },
  { id: 'ac-4', name: 'World Junior Athletics Championships', regStatus: 'closed' },
  { id: 'ac-5', name: 'Regional Athletics Meet 2026', regStatus: 'draft' },
]

export default function RegistrationConfig() {
  const [selectedChamp, setSelectedChamp] = useState(null)
  const [maxEvents, setMaxEvents] = useState(3)
  const [pricing, setPricing] = useState([
    { events: 1, fee: 500 },
    { events: 2, fee: 800 },
    { events: 3, fee: 1000 },
  ])
  const [showPublishDialog, setShowPublishDialog] = useState(false)
  const [showCloseDialog, setShowCloseDialog] = useState(false)
  const [toast, setToast] = useState(null)

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handlePublish = () => {
    showToast('Registration published successfully! Championship is now visible on Athlete Portal.')
  }

  const handleClose = () => {
    showToast('Registration closed. Athletes can no longer register.')
  }

  const handleSave = () => {
    showToast('Registration configuration saved successfully!')
  }

  if (!selectedChamp) {
    return (
      <div className="space-y-4">
        <label className="block text-sm font-semibold text-[#0F172A] mb-1.5">Select Championship</label>
        <select onChange={e => {
          const champ = mockChampionships.find(c => c.id === e.target.value)
          setSelectedChamp(champ)
        }} value="" className="w-full max-w-md px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-[#0F172A] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all">
          <option value="">Choose a championship...</option>
          {mockChampionships.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
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
          <StatusBadge status={selectedChamp.regStatus} />
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
        <div className="flex flex-wrap gap-4">
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}
            onClick={() => setShowPublishDialog(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 text-white text-sm font-bold hover:bg-emerald-600 transition-all shadow-sm">
            <Globe size={18} /> Publish Registration
          </motion.button>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}
            onClick={() => setShowCloseDialog(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition-all shadow-sm">
            <Lock size={18} /> Close Registration
          </motion.button>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary-dark transition-all shadow-sm">
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

      {toast && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-sm font-semibold ${
            toast.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
          {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
          {toast.message}
        </motion.div>
      )}
    </div>
  )
}
