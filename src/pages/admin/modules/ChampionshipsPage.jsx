import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft } from 'lucide-react'
import ChampionshipTable from '../../../components/admin/ChampionshipTable'
import ChampionshipForm from '../../../components/admin/ChampionshipForm'
import { adminChampionships } from '../../../data/adminData'

export default function ChampionshipsPage() {
  const [championships, setChampionships] = useState(adminChampionships)
  const [view, setView] = useState('list')
  const [editingChamp, setEditingChamp] = useState(null)

  const handleCreate = () => {
    setEditingChamp(null)
    setView('form')
  }

  const handleEdit = (champ) => {
    setEditingChamp(champ)
    setView('form')
  }

  const handleView = (champ) => {
    alert(`View championship: ${champ.name}\n(This will open a detail page in future updates.)`)
  }

  const handleDelete = (id) => {
    setChampionships(prev => prev.filter(c => c.id !== id))
  }

  const handleSave = (data) => {
    if (editingChamp) {
      setChampionships(prev => prev.map(c => c.id === editingChamp.id ? { ...data, id: c.id } : c))
    } else {
      const newChamp = { ...data, id: `ac-${Date.now()}`, registrationStatus: 'draft', publishStatus: 'draft', athleteCount: 0, createdAt: new Date().toISOString() }
      setChampionships(prev => [newChamp, ...prev])
    }
    setView('list')
    setEditingChamp(null)
  }

  return (
    <div>
      <AnimatePresence mode="wait">
        {view === 'list' ? (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ChampionshipTable
              championships={championships}
              loading={false}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onCreate={handleCreate}
            />
          </motion.div>
        ) : (
          <motion.div key="form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="mb-6">
              <button onClick={() => { setView('list'); setEditingChamp(null) }}
                className="inline-flex items-center gap-1.5 text-sm text-[#64748B] hover:text-[#0F172A] transition-colors">
                <ChevronLeft size={16} /> Back to Championships
              </button>
            </div>
            <ChampionshipForm championship={editingChamp} onSave={handleSave} onCancel={() => { setView('list'); setEditingChamp(null) }} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
