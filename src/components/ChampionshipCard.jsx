import { motion } from 'framer-motion'
import { MapPin, Calendar } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function ChampionshipCard({ championship, index }) {
  const dateRange = championship.startDate && championship.endDate
    ? `${championship.startDate} - ${championship.endDate}`
    : championship.startDate || ''

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -6 }}
      className="group bg-surface rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={championship.banner || 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80'}
          alt={championship.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />
        <span className="absolute top-3 left-3 px-3 py-1 bg-primary text-white text-xs font-semibold rounded-full shadow capitalize">
          {championship.registrationStatus || 'draft'}
        </span>
      </div>

      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">
          {championship.name}
        </h3>

        <div className="space-y-1.5 mb-4 text-sm text-gray-500">
          <p className="flex items-center gap-1.5">
            <MapPin size={14} className="text-primary shrink-0" />
            <span className="truncate">{championship.venue}{championship.district ? `, ${championship.district}` : ''}</span>
          </p>
          <p className="flex items-center gap-1.5">
            <Calendar size={14} className="text-primary shrink-0" />
            <span>{dateRange}</span>
          </p>
        </div>

        <Link
          to={`/results/${championship.championship_id}`}
          className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-primary hover:bg-primary hover:text-white hover:border-primary transition-all duration-200"
        >
          View Championship
        </Link>
      </div>
    </motion.div>
  )
}
