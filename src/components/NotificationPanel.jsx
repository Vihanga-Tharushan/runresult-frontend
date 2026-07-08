import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Bell, CheckCircle, DollarSign, Trophy, BarChart3, ArrowRight } from 'lucide-react'

const notifications = [
  { icon: CheckCircle, title: 'Registration Approved', desc: 'National Athletics Championships 2026', time: '2 hours ago', color: 'text-emerald-600 bg-emerald-50' },
  { icon: DollarSign, title: 'Payment Successful', desc: '$50.00 registration fee confirmed.', time: '5 hours ago', color: 'text-blue-600 bg-blue-50' },
  { icon: Trophy, title: 'New Championship Available', desc: 'International Track & Field Series open.', time: '1 day ago', color: 'text-primary bg-primary/5' },
  { icon: BarChart3, title: 'Results Published', desc: 'Round 1 results are now available.', time: '2 days ago', color: 'text-purple-600 bg-purple-50' },
]

export default function NotificationPanel() {
  return (
    <section className="py-12 lg:py-16 bg-[#FCFCFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-end justify-between mb-8 lg:mb-10"
        >
          <div>
            <span className="text-primary text-xs font-semibold uppercase tracking-widest">Updates</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] mt-1">
              Notifications
            </h2>
          </div>
          <Link
            to="/notifications"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-dark transition-colors"
          >
            View All
            <ArrowRight size={15} />
          </Link>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-4 lg:gap-5">
          {notifications.map((n, i) => {
            const Icon = n.icon
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                whileHover={{ x: 3 }}
                className="flex items-start gap-4 bg-white rounded-2xl border border-gray-100 p-4 lg:p-5 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
              >
                <div className={`w-10 h-10 rounded-xl ${n.color} flex items-center justify-center shrink-0`}>
                  <Icon size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-bold text-[#0F172A]">{n.title}</h3>
                    <span className="text-[10px] text-[#64748B] shrink-0 mt-0.5">{n.time}</span>
                  </div>
                  <p className="text-xs text-[#64748B] mt-0.5 line-clamp-1">{n.desc}</p>
                </div>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-8 sm:hidden"
        >
          <Link
            to="/notifications"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all duration-200 shadow-sm text-sm"
          >
            View All Notifications
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
