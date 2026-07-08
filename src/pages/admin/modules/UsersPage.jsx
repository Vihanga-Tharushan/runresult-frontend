import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft } from 'lucide-react'
import StaffTable from '../../../components/admin/StaffTable'
import StaffForm from '../../../components/admin/StaffForm'
import { adminStaffMembers } from '../../../data/adminData'

export default function UsersPage() {
  const [staff, setStaff] = useState(adminStaffMembers)
  const [showForm, setShowForm] = useState(false)
  const [editingStaff, setEditingStaff] = useState(null)

  const handleCreate = () => {
    setEditingStaff(null)
    setShowForm(true)
  }

  const handleEdit = (member) => {
    setEditingStaff(member)
    setShowForm(true)
  }

  const handleDelete = (id) => {
    setStaff(prev => prev.filter(s => s.id !== id))
  }

  const handleSave = (data) => {
    if (editingStaff) {
      setStaff(prev => prev.map(s => s.id === editingStaff.id ? { ...s, ...data } : s))
    } else {
      const newMember = {
        id: `staff-${Date.now()}`,
        name: '',
        email: data.email,
        phone: '',
        role: '',
        createdDate: new Date().toISOString().split('T')[0],
        lastLogin: null,
        status: 'active',
      }
      setStaff(prev => [newMember, ...prev])
    }
    setShowForm(false)
    setEditingStaff(null)
  }

  return (
    <div>
      <AnimatePresence mode="wait">
        {!showForm ? (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <StaffTable staff={staff} loading={false} onEdit={handleEdit} onDelete={handleDelete} onCreate={handleCreate} />
          </motion.div>
        ) : (
          <motion.div key="form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="mb-6">
              <button onClick={() => { setShowForm(false); setEditingStaff(null) }}
                className="inline-flex items-center gap-1.5 text-sm text-[#64748B] hover:text-[#0F172A] transition-colors">
                <ChevronLeft size={16} /> Back to Staff List
              </button>
            </div>
            <StaffForm onSave={handleSave} onCancel={() => { setShowForm(false); setEditingStaff(null) }} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
