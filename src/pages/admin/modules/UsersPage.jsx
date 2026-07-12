import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'
import StaffTable from '../../../components/admin/StaffTable'
import StaffForm from '../../../components/admin/StaffForm'

const API = import.meta.env.VITE_API_URL

function authHeaders() {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export default function UsersPage() {
  const [staff, setStaff] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingMember, setEditingMember] = useState(null)

  useEffect(() => {
    axios.get(API + '/api/users/staff', { headers: authHeaders() })
      .then(res => setStaff(res.data.staff))
      .catch(() => toast.error('Failed to load staff'))
      .finally(() => setLoading(false))
  }, [])

  const handleCreate = () => {
    setEditingMember(null)
    setShowForm(true)
  }

  const handleView = (member) => {
    setEditingMember(member)
    setShowForm(true)
  }

  const handleDelete = (id) => {
    axios.delete(API + `/api/users/${id}`, { headers: authHeaders() })
      .then(() => {
        setStaff(prev => prev.filter(s => s._id !== id))
        toast.success('Staff account deleted successfully')
      })
      .catch(() => toast.error('Failed to delete staff account'))
  }

  const handleSave = (data) => {
    if (data._id) {
      axios.put(API + `/api/users/${data._id}`, data, { headers: authHeaders() })
        .then(() => {
          setStaff(prev => prev.map(s => s._id === data._id ? { ...s, name: data.name } : s))
          toast.success('Staff account updated successfully')
          setShowForm(false)
          setEditingMember(null)
        })
        .catch(err => toast.error(err.response?.data?.message || 'Failed to update staff account'))
    } else {
      axios.post(API + '/api/users/staff', data, { headers: authHeaders() })
        .then(res => {
          setStaff(prev => [res.data.user, ...prev])
          toast.success('Staff account created successfully')
          setShowForm(false)
        })
        .catch(err => toast.error(err.response?.data?.message || 'Failed to create staff account'))
    }
  }

  return (
    <div>
      <AnimatePresence mode="wait">
        {!showForm ? (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <StaffTable staff={staff} loading={loading} onDelete={handleDelete} onCreate={handleCreate} onView={handleView} />
          </motion.div>
        ) : (
          <motion.div key="form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="mb-6">
              <button onClick={() => { setShowForm(false); setEditingMember(null) }}
                className="inline-flex items-center gap-1.5 text-sm text-[#64748B] hover:text-[#0F172A] transition-colors">
                <ChevronLeft size={16} /> Back to Staff List
              </button>
            </div>
            <StaffForm member={editingMember} onSave={handleSave} onCancel={() => { setShowForm(false); setEditingMember(null) }} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
