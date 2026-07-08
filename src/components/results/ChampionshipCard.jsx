import { motion } from 'framer-motion'
import { MapPin, Calendar, Building2, ArrowRight, Medal } from 'lucide-react'
import { Link } from 'react-router-dom'

const statusStyles = {
  completed: 'bg-emerald-500 text-white',
  ongoing: 'bg-primary text-white',
  upcoming: 'text-amber-600 bg-amber-50 border border-amber-200',
}

export default function ChampionshipCard({ championship, index }) {
  const statusLabel = championship.status.charAt(0).toUpperCase() + championship.status.slice(1)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -6 }}
      className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
    >
      <div className="relative h-44 lg:h-48 overflow-hidden">
        <img
          src={championship.banner}
          alt={championship.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/10 to-transparent" />
        <span className={`absolute top-3 left-3 px-3 py-1 text-xs font-semibold rounded-full shadow-sm ${statusStyles[championship.status] || 'bg-gray-500 text-white'}`}>
          {statusLabel}
        </span>
      </div>

      <div className="p-5">
        <h3 className="text-base lg:text-lg font-bold text-[#0F172A] mb-3 leading-snug line-clamp-2">
          {championship.name}
        </h3>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-xs lg:text-sm text-[#64748B]">
            <MapPin size={13} className="text-primary shrink-0" />
            <span className="truncate">{championship.venue}</span>
          </div>
          <div className="flex items-center gap-2 text-xs lg:text-sm text-[#64748B]">
            <Building2 size={13} className="text-primary shrink-0" />
            <span className="truncate">{championship.organizer}</span>
          </div>
          <div className="flex items-center gap-2 text-xs lg:text-sm text-[#64748B]">
            <Calendar size={13} className="text-primary shrink-0" />
            <span>{championship.startDate} - {championship.endDate}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <Link
            to={`/results/${championship.id}`}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs lg:text-sm font-semibold text-white bg-primary rounded-xl hover:bg-primary-dark transition-all duration-200 shadow-sm shadow-primary/20"
          >
            <Medal size={14} />
            View Results
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
