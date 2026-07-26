import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'
import PreviousResultTable from '../../../components/admin/PreviousResultTable'
import PreviousResultForm from '../../../components/admin/PreviousResultForm'

const API = import.meta.env.VITE_API_URL

function authHeaders() {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export default function PreviousResultsPage() {
  const [previousResults, setPreviousResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState('list')
  const [editingResult, setEditingResult] = useState(null)

  useEffect(() => {
    axios.get(API + '/api/previous-results', { headers: authHeaders() })
      .then(res => setPreviousResults(res.data.previousResults))
      .catch(() => toast.error('Failed to load previous results'))
      .finally(() => setLoading(false))
  }, [])

  const handleCreate = () => {
    setEditingResult(null)
    setView('form')
  }

  const handleView = (result) => {
    setEditingResult(result)
    setView('form')
  }

  const handleDelete = (result) => {
    axios.delete(API + `/api/previous-results/${result._id}`, { headers: authHeaders() })
      .then(() => {
        setPreviousResults(prev => prev.filter(r => r._id !== result._id))
        toast.success('Previous result deleted successfully')
        setView('list')
        setEditingResult(null)
      })
      .catch(() => toast.error('Failed to delete previous result'))
  }

  const handleSave = (data) => {
    if (editingResult) {
      axios.put(API + `/api/previous-results/${editingResult._id}`, data, { headers: authHeaders() })
        .then(res => {
          setPreviousResults(prev => prev.map(r => r._id === editingResult._id ? res.data.previousResult : r))
          toast.success('Previous result updated successfully')
          setView('list')
          setEditingResult(null)
        })
        .catch(() => toast.error('Failed to update previous result'))
    } else {
      axios.post(API + '/api/previous-results', data, { headers: authHeaders() })
        .then(res => {
          setPreviousResults(prev => [res.data.previousResult, ...prev])
          toast.success('Previous result created successfully')
          setView('list')
        })
        .catch(() => toast.error('Failed to create previous result'))
    }
  }

  return (
    <div>
      <AnimatePresence mode="wait">
        {view === 'list' ? (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <PreviousResultTable
              previousResults={previousResults}
              loading={loading}
              onCreate={handleCreate}
              onView={handleView}
            />
          </motion.div>
        ) : (
          <motion.div key="form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="mb-6">
              <button onClick={() => { setView('list'); setEditingResult(null) }}
                className="inline-flex items-center gap-1.5 text-sm text-[#64748B] hover:text-[#0F172A] transition-colors">
                <ChevronLeft size={16} /> Back to Previous Results
              </button>
            </div>
            <PreviousResultForm previousResult={editingResult} onSave={handleSave} onCancel={() => { setView('list'); setEditingResult(null) }} onDelete={handleDelete} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
