import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'
import ChampionshipTable from '../../../components/admin/ChampionshipTable'
import ChampionshipForm from '../../../components/admin/ChampionshipForm'

const API = import.meta.env.VITE_API_URL

function authHeaders() {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export default function ChampionshipsPage() {
  
  const [championships, setChampionships] = useState([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState('list')
  const [editingChamp, setEditingChamp] = useState(null)

  useEffect(() => {
    axios.get(API + '/api/championships', { headers: authHeaders() })
      .then(res => setChampionships(res.data.championships))
      .catch(() => toast.error('Failed to load championships'))
      .finally(() => setLoading(false))
  }, [])

  const handleCreate = () => {
    setEditingChamp(null)
    setView('form')
  }

  const handleView = (champ) => {
    setEditingChamp(champ)
    setView('form')
  }

  const handleDelete = (champ) => {
    axios.delete(API + `/api/championships/${champ._id}`, { headers: authHeaders() })
      .then(() => {
        setChampionships(prev => prev.filter(c => c._id !== champ._id))
        toast.success('Championship deleted successfully')
        setView('list')
        setEditingChamp(null)
      })
      .catch(() => toast.error('Failed to delete championship'))
  }

  const handleSave = (data) => {
    if (editingChamp) {
      axios.put(API + `/api/championships/${editingChamp._id}`, data, { headers: authHeaders() })
        .then(res => {
          setChampionships(prev => prev.map(c => c._id === editingChamp._id ? res.data.championship : c))
          toast.success('Championship updated successfully')
          setView('list')
          setEditingChamp(null)
        })
        .catch(() => toast.error('Failed to update championship'))
    } else {
      axios.post(API + '/api/championships', data, { headers: authHeaders() })
        .then(res => {
          setChampionships(prev => [res.data.championship, ...prev])
          toast.success('Championship created successfully')
          setView('list')
        })
        .catch(() => toast.error('Failed to create championship'))
    }
  }

  return (
    <div>
      <AnimatePresence mode="wait">
        {view === 'list' ? (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ChampionshipTable
              championships={championships}
              loading={loading}
              onCreate={handleCreate}
              onView={handleView}
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
            <ChampionshipForm championship={editingChamp} onSave={handleSave} onCancel={() => { setView('list'); setEditingChamp(null) }} onDelete={handleDelete} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
