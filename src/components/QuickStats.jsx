import { motion } from 'framer-motion'
import { Trophy, Calendar, BarChart3, Zap } from 'lucide-react'

const stats = [
  { icon: Trophy, label: 'Registered Championships', value: '05', color: 'from-primary to-primary-light' },
  { icon: Calendar, label: 'Upcoming Events', value: '02', color: 'from-amber-500 to-orange-500' },
  { icon: BarChart3, label: 'Results Published', value: '12', color: 'from-emerald-500 to-teal-500' },
  { icon: Zap, label: 'Personal Bests', value: '08', color: 'from-violet-500 to-purple-500' },
]

export default function QuickStats() {
  return (
    <section className="py-12 lg:py-16 bg-[#FCFCFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl border border-gray-100 p-5 lg:p-6 shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-linear-to-br ${stat.color} flex items-center justify-center mb-3 shadow-sm`}>
                  <Icon size={18} className="text-white" />
                </div>
                <p className="text-2xl lg:text-3xl font-extrabold text-[#0F172A] mb-0.5">{stat.value}</p>
                <p className="text-xs lg:text-sm text-[#64748B] font-medium">{stat.label}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
