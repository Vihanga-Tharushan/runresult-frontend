import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Trophy, Users, FileText, Table, ArrowRight, Activity } from 'lucide-react'
import DashboardStats from '../../../components/admin/DashboardStats'
import { adminChampionships, recentActivity, adminStaffMembers } from '../../../data/adminData'
import { StatsSkeleton } from '../../../components/admin/LoadingSkeleton'

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  const stats = {
    totalChampionships: adminChampionships.length,
    activeChampionships: adminChampionships.filter(c => c.registrationStatus === 'open' || c.registrationStatus === 'closing-soon').length,
    registeredAthletes: adminChampionships.reduce((sum, c) => sum + c.athleteCount, 0),
    pendingRegistrations: 28,
    staffMembers: adminStaffMembers.length,
  }

  const quickActions = [
    { label: 'New Championship', path: '/admin/championships', icon: Trophy, color: 'bg-blue-50 text-blue-600' },
    { label: 'Configure Forms', path: '/admin/forms', icon: FileText, color: 'bg-purple-50 text-purple-600' },
    { label: 'Google Sheets', path: '/admin/google-sheets', icon: Table, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Staff Accounts', path: '/admin/users', icon: Users, color: 'bg-amber-50 text-amber-600' },
  ]

  return (
    <div className="space-y-6 lg:space-y-8">
      {loading ? <StatsSkeleton /> : <DashboardStats stats={stats} />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-base font-bold text-[#0F172A]">Recent Activity</h2>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50">
            {recentActivity.slice(0, 5).map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-start gap-3 px-5 py-4 hover:bg-gray-50/50 transition-colors"
              >
                <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                  activity.type === 'registration' ? 'bg-blue-50 text-blue-600' :
                  activity.type === 'championship' ? 'bg-purple-50 text-purple-600' :
                  activity.type === 'publish' ? 'bg-emerald-50 text-emerald-600' :
                  activity.type === 'staff' ? 'bg-amber-50 text-amber-600' : 'bg-gray-50 text-gray-600'
                }`}>
                  <Activity size={15} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#0F172A]">{activity.message}</p>
                  <p className="text-xs text-[#64748B] mt-0.5">{activity.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-base font-bold text-[#0F172A]">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-3">
            {quickActions.map((action, index) => {
              const ActionIcon = action.icon
              return (
                <motion.div
                  key={action.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link to={action.path}
                    className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-200 group"
                  >
                    <div className={`w-10 h-10 rounded-xl ${action.color} flex items-center justify-center`}>
                      <ActionIcon size={18} />
                    </div>
                    <span className="flex-1 text-sm font-semibold text-[#0F172A]">{action.label}</span>
                    <ArrowRight size={15} className="text-[#64748B] group-hover:text-primary transition-colors" />
                  </Link>
                </motion.div>
              )
            })}
          </div>

          <h2 className="text-base font-bold text-[#0F172A] pt-4">Active Championships</h2>
          {adminChampionships.filter(c => c.registrationStatus === 'open' || c.registrationStatus === 'closing-soon').slice(0, 3).map((champ, index) => (
            <motion.div
              key={champ.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center overflow-hidden shrink-0">
                {champ.banner ? <img src={champ.banner} alt="" className="w-full h-full object-cover" /> : <Trophy size={16} className="text-primary" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#0F172A] truncate">{champ.name}</p>
                <p className="text-xs text-[#64748B]">{champ.athleteCount} athletes</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
