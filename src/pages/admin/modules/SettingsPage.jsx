import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save, User } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

const API = import.meta.env.VITE_API_URL

function authHeaders() {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        setProfile(prev => ({ ...prev, name: payload.name || '', email: payload.email || '' }))
      } catch {}
    }
    setLoading(false)
  }, [])

  const handleSaveProfile = (e) => {
    e.preventDefault()
    if (profile.newPassword && profile.newPassword !== profile.confirmNewPassword) {
      toast.error('New passwords do not match')
      return
    }
    const data = { name: profile.name }
    if (profile.currentPassword && profile.newPassword) {
      data.currentPassword = profile.currentPassword
      data.newPassword = profile.newPassword
    }
    axios.put(API + '/api/users/me', data, { headers: authHeaders() })
      .then(() => {
        toast.success('Settings saved successfully!')
        setProfile(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmNewPassword: '' }))
      })
      .catch(err => toast.error(err.response?.data?.message || 'Failed to save settings'))
  }

  return (
    <div className="max-w-3xl">
      {loading ? (
        <div className="animate-pulse bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-6">
          <div className="h-8 bg-gray-100 rounded-lg w-48" />
          <div className="h-10 bg-gray-100 rounded-xl w-full" />
          <div className="h-10 bg-gray-100 rounded-xl w-full" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <User size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0F172A]">Profile Settings</h3>
              <p className="text-sm text-[#64748B]">Update your admin profile information</p>
            </div>
          </div>
          <form onSubmit={handleSaveProfile} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-[#0F172A] mb-1.5">Full Name</label>
                <input type="text" value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-[#0F172A] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0F172A] mb-1.5">Email Address</label>
                <input type="email" value={profile.email} disabled
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-[#64748B] cursor-not-allowed" />
              </div>
            </div>
            <div className="border-t border-gray-100 pt-5">
              <h4 className="text-sm font-bold text-[#0F172A] mb-4">Change Password</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-[#0F172A] mb-1.5">Current Password</label>
                  <input type="password" value={profile.currentPassword} onChange={e => setProfile({ ...profile, currentPassword: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-[#0F172A] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#0F172A] mb-1.5">New Password</label>
                  <input type="password" value={profile.newPassword} onChange={e => setProfile({ ...profile, newPassword: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-[#0F172A] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all" />
                </div>
              </div>
              <div className="mt-5">
                <label className="block text-sm font-semibold text-[#0F172A] mb-1.5">Confirm New Password</label>
                <input type="password" value={profile.confirmNewPassword} onChange={e => setProfile({ ...profile, confirmNewPassword: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-[#0F172A] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all" />
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-all shadow-sm">
                <Save size={16} /> Save Changes
              </motion.button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
