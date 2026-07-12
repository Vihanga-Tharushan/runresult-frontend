import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Lock, X, CheckCircle, User } from 'lucide-react'

export default function StaffForm({ member, onSave, onCancel }) {
  const isEditing = !!member
  const [form, setForm] = useState({ name: member?.name || '', email: member?.email || '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})

  const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }))

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    if (!form.email) errs.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email address'
    if (!isEditing) {
      if (!form.password) errs.password = 'Password is required'
      else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters'
      if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match'
    } else {
      if (form.password && form.password.length < 6) errs.password = 'Password must be at least 6 characters'
      if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    const data = { name: form.name.trim(), email: form.email }
    if (form.password) data.password = form.password
    if (isEditing) data._id = member._id
    onSave(data)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:p-8 max-w-lg"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-[#0F172A]">{isEditing ? 'Edit Staff Account' : 'Create Staff Account'}</h3>
        <button onClick={onCancel} className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-gray-50 transition-colors">
          <X size={18} />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-[#0F172A] mb-1.5">Full Name</label>
          <div className="relative">
            <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
            <input type="text" value={form.name} onChange={e => update('name', e.target.value)}
              placeholder="John Doe"
              className={`w-full pl-10 pr-4 py-2.5 bg-white border rounded-xl text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 transition-all ${
                errors.name ? 'border-red-300 focus:border-red-500 focus:ring-red/10' : 'border-gray-200 focus:border-primary focus:ring-primary/10'
              }`} />
          </div>
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#0F172A] mb-1.5">Email Address</label>
          <div className="relative">
            <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
            <input type="email" value={form.email} onChange={e => update('email', e.target.value)}
              placeholder="staff@example.com" disabled={isEditing}
              className={`w-full pl-10 pr-4 py-2.5 bg-white border rounded-xl text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 transition-all ${
                isEditing ? 'bg-gray-50 text-[#64748B] cursor-not-allowed' : ''
              } ${
                errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red/10' : 'border-gray-200 focus:border-primary focus:ring-primary/10'
              }`} />
          </div>
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#0F172A] mb-1.5">{isEditing ? 'New Password (leave blank to keep current)' : 'Temporary Password'}</label>
          <div className="relative">
            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
            <input type="text" value={form.password} onChange={e => update('password', e.target.value)}
              placeholder={isEditing ? 'Enter new password' : 'Enter temporary password'}
              className={`w-full pl-10 pr-4 py-2.5 bg-white border rounded-xl text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 transition-all ${
                errors.password ? 'border-red-300 focus:border-red-500 focus:ring-red/10' : 'border-gray-200 focus:border-primary focus:ring-primary/10'
              }`} />
          </div>
          {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#0F172A] mb-1.5">{isEditing ? 'Confirm New Password' : 'Confirm Password'}</label>
          <div className="relative">
            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
            <input type="text" value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)}
              placeholder={isEditing ? 'Confirm new password' : 'Confirm temporary password'}
              className={`w-full pl-10 pr-4 py-2.5 bg-white border rounded-xl text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 transition-all ${
                errors.confirmPassword ? 'border-red-300 focus:border-red-500 focus:ring-red/10' : 'border-gray-200 focus:border-primary focus:ring-primary/10'
              }`} />
          </div>
          {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button type="button" onClick={onCancel}
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-[#64748B] hover:bg-gray-50 hover:text-[#0F172A] transition-all">
            Cancel
          </button>
          <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-all shadow-sm">
            <CheckCircle size={16} /> {isEditing ? 'Save Changes' : 'Create Staff Account'}
          </motion.button>
        </div>
      </form>
    </motion.div>
  )
}
