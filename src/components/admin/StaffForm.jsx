import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Lock, X, CheckCircle } from 'lucide-react'

export default function StaffForm({ onSave, onCancel }) {
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})

  const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }))

  const validate = () => {
    const errs = {}
    if (!form.email) errs.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email address'
    if (!form.password) errs.password = 'Password is required'
    else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters'
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    onSave({ email: form.email, password: form.password })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:p-8 max-w-lg"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-[#0F172A]">Create Staff Account</h3>
        <button onClick={onCancel} className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-gray-50 transition-colors">
          <X size={18} />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-[#0F172A] mb-1.5">Email Address</label>
          <div className="relative">
            <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
            <input type="email" value={form.email} onChange={e => update('email', e.target.value)}
              placeholder="staff@example.com"
              className={`w-full pl-10 pr-4 py-2.5 bg-white border rounded-xl text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 transition-all ${
                errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red/10' : 'border-gray-200 focus:border-primary focus:ring-primary/10'
              }`} />
          </div>
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#0F172A] mb-1.5">Temporary Password</label>
          <div className="relative">
            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
            <input type="text" value={form.password} onChange={e => update('password', e.target.value)}
              placeholder="Enter temporary password"
              className={`w-full pl-10 pr-4 py-2.5 bg-white border rounded-xl text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 transition-all ${
                errors.password ? 'border-red-300 focus:border-red-500 focus:ring-red/10' : 'border-gray-200 focus:border-primary focus:ring-primary/10'
              }`} />
          </div>
          {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#0F172A] mb-1.5">Confirm Password</label>
          <div className="relative">
            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
            <input type="text" value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)}
              placeholder="Confirm temporary password"
              className={`w-full pl-10 pr-4 py-2.5 bg-white border rounded-xl text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 transition-all ${
                errors.confirmPassword ? 'border-red-300 focus:border-red-500 focus:ring-red/10' : 'border-gray-200 focus:border-primary focus:ring-primary/10'
              }`} />
          </div>
          {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
        </div>
        <p className="text-xs text-[#64748B] bg-gray-50 rounded-xl p-3">
          Future fields will include: Full Name, Phone Number, and Role selection.
        </p>
        <div className="flex items-center justify-end gap-3 pt-2">
          <button type="button" onClick={onCancel}
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-[#64748B] hover:bg-gray-50 hover:text-[#0F172A] transition-all">
            Cancel
          </button>
          <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-all shadow-sm">
            <CheckCircle size={16} /> Create Staff Account
          </motion.button>
        </div>
      </form>
    </motion.div>
  )
}
