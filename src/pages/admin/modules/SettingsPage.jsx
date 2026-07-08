import { useState } from 'react'
import { motion } from 'framer-motion'
import { Save, CheckCircle, User, Globe, Bell, Shield } from 'lucide-react'
import { adminProfile } from '../../../data/adminData'

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    name: adminProfile.name,
    email: adminProfile.email,
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  })
  const [toast, setToast] = useState(null)

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const handleSaveProfile = (e) => {
    e.preventDefault()
    showToast('Settings saved successfully!')
  }

  return (
    <div className="max-w-3xl space-y-8">
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
              <input type="email" value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-[#0F172A] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all" />
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
          </div>
          <div className="flex justify-end pt-2">
            <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-all shadow-sm">
              <Save size={16} /> Save Changes
            </motion.button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Globe size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#0F172A]">System Preferences</h3>
            <p className="text-sm text-[#64748B]">Configure global system settings</p>
          </div>
        </div>
        <div className="space-y-4">
          {[
            { label: 'Allow athlete self-registration', desc: 'Athletes can register for championships without staff approval', icon: User },
            { label: 'Send email notifications', desc: 'Automatically send email updates for registration and results', icon: Bell },
            { label: 'Enable two-factor authentication', desc: 'Extra security layer for admin and staff accounts', icon: Shield },
          ].map((setting, index) => {
            const SettingIcon = setting.icon
            return (
              <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-gray-50/50 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
                    <SettingIcon size={16} className="text-[#64748B]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#0F172A]">{setting.label}</p>
                    <p className="text-xs text-[#64748B]">{setting.desc}</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked={index < 2} className="sr-only peer" />
                  <div className="w-10 h-5.5 bg-gray-200 rounded-full peer peer-checked:bg-primary after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:after:translate-x-[18px]" />
                </label>
              </div>
            )
          })}
        </div>
      </div>

      {toast && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-sm font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle size={18} /> {toast}
        </motion.div>
      )}
    </div>
  )
}
