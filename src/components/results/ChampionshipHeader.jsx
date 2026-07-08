import { motion } from 'framer-motion'
import { MapPin, Building2, Calendar, Medal, Users } from 'lucide-react'

const statusStyles = {
  completed: 'bg-emerald-500',
  ongoing: 'bg-primary',
  upcoming: 'bg-amber-500',
}

export default function ChampionshipHeader({ championship }) {
  const statusLabel = championship.status.charAt(0).toUpperCase() + championship.status.slice(1)

  return (
    <section className="relative overflow-hidden bg-linear-to-br from-blue-50/50 via-white to-white">
      <div className="relative">
        <div className="h-48 lg:h-64 overflow-hidden">
          <img
            src={championship.banner}
            alt={championship.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative -mt-20 lg:-mt-24 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8"
          >
            <div className="flex flex-col lg:flex-row lg:items-start gap-6">
              <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-xl overflow-hidden shadow-sm shrink-0 bg-gray-50">
                <img
                  src={championship.logo}
                  alt={championship.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                  <h1 className="text-xl lg:text-2xl font-extrabold text-[#0F172A] leading-tight">
                    {championship.name}
                  </h1>
                  <span className={`inline-flex self-start px-3 py-1 text-xs font-semibold text-white rounded-full ${statusStyles[championship.status] || 'bg-gray-500'}`}>
                    {statusLabel}
                  </span>
                </div>

                <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs lg:text-sm text-[#64748B]">
                  <span className="inline-flex items-center gap-1.5">
                    <Building2 size={14} className="text-primary" />
                    {championship.organizer}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin size={14} className="text-primary" />
                    {championship.venue}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar size={14} className="text-primary" />
                    {championship.startDate} - {championship.endDate}
                  </span>
                </div>

                <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center">
                      <Medal size={15} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#0F172A]">{championship.eventCount}</p>
                      <p className="text-[10px] text-[#64748B] leading-tight">Events</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center">
                      <Users size={15} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#0F172A]">{championship.athleteCount}</p>
                      <p className="text-[10px] text-[#64748B] leading-tight">Athletes</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
