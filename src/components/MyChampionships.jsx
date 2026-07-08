import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Calendar, ArrowRight, CheckCircle, Clock, AlertTriangle } from 'lucide-react'

const myChamps = [
  {
    id: 1,
    name: 'National Athletics Championships 2026',
    date: '15 - 20 August 2026',
    regStatus: 'Approved',
    paymentStatus: 'Paid',
    statusColor: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    icon: CheckCircle,
  },
  {
    id: 2,
    name: 'International Track & Field Series',
    date: '22 - 27 October 2026',
    regStatus: 'Pending Approval',
    paymentStatus: 'Unpaid',
    statusColor: 'text-amber-600 bg-amber-50 border-amber-200',
    icon: Clock,
  },
  {
    id: 3,
    name: 'World Junior Swimming Trials',
    date: '5 - 9 September 2026',
    regStatus: 'Approved',
    paymentStatus: 'Pending',
    statusColor: 'text-blue-600 bg-blue-50 border-blue-200',
    icon: AlertTriangle,
  },
]

export default function MyChampionships() {
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
            <span className="text-primary text-xs font-semibold uppercase tracking-widest">Registered</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] mt-1">
              My Upcoming Championships
            </h2>
          </div>
          <Link
            to="/my-championships"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-dark transition-colors"
          >
            View All
            <ArrowRight size={15} />
          </Link>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {myChamps.map((champ, i) => {
            const StatusIcon = champ.icon
            return (
              <motion.div
                key={champ.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl border border-gray-100 p-5 lg:p-6 shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2 text-xs text-[#64748B]">
                    <Calendar size={13} className="text-primary" />
                    <span>{champ.date}</span>
                  </div>
                  <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${champ.statusColor}`}>
                    <StatusIcon size={11} />
                    {champ.regStatus}
                  </div>
                </div>

                <h3 className="text-sm lg:text-base font-bold text-[#0F172A] mb-3 leading-snug">
                  {champ.name}
                </h3>

                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs text-[#64748B]">Payment:</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    champ.paymentStatus === 'Paid'
                      ? 'text-emerald-600 bg-emerald-50'
                      : champ.paymentStatus === 'Pending'
                      ? 'text-amber-600 bg-amber-50'
                      : 'text-red-600 bg-red-50'
                  }`}>
                    {champ.paymentStatus}
                  </span>
                </div>

                <Link
                  to={`/championship/${champ.id}`}
                  className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs lg:text-sm font-semibold text-primary border-2 border-primary/20 rounded-xl hover:bg-primary/5 hover:border-primary/40 transition-all duration-200"
                >
                  View Details
                  <ArrowRight size={14} />
                </Link>
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
            to="/my-championships"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all duration-200 shadow-sm text-sm"
          >
            View All Registrations
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
