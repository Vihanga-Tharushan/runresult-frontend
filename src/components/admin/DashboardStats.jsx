import { motion } from 'framer-motion'
import { Trophy, Users, Clock, UserCheck, Shield } from 'lucide-react'

const statsConfig = [
  { key: 'totalChampionships', label: 'Total Championships', icon: Trophy, color: 'bg-blue-50 text-blue-600', change: '+2 this month' },
  { key: 'activeChampionships', label: 'Active Championships', icon: Clock, color: 'bg-emerald-50 text-emerald-600', change: '3 currently open' },
  { key: 'registeredAthletes', label: 'Registered Athletes', icon: Users, color: 'bg-purple-50 text-purple-600', change: '1,350 total' },
  { key: 'pendingRegistrations', label: 'Pending Registrations', icon: UserCheck, color: 'bg-amber-50 text-amber-600', change: '28 need review' },
  { key: 'staffMembers', label: 'Staff Members', icon: Shield, color: 'bg-cyan-50 text-cyan-600', change: '5 active accounts' },
]

export default function DashboardStats({ stats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6">
      {statsConfig.map((config, index) => {
        const StatIcon = config.icon
        const value = stats[config.key] || 0
        return (
          <motion.div
            key={config.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 lg:p-6 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">{config.label}</span>
              <div className={`w-10 h-10 rounded-xl ${config.color} flex items-center justify-center`}>
                <StatIcon size={18} />
              </div>
            </div>
            <p className="text-3xl lg:text-4xl font-extrabold text-[#0F172A] tracking-tight">{value}</p>
            <p className="text-xs text-[#64748B] mt-1.5">{config.change}</p>
          </motion.div>
        )
      })}
    </div>
  )
}
