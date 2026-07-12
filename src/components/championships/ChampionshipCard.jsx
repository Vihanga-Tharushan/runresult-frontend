import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { MapPin, Calendar, Clock, DollarSign, CheckCircle, ArrowRight, Users } from 'lucide-react'
import StatusBadge from './StatusBadge'

export default function ChampionshipCard({ championship, index }) {
  const isRegistrationOpen = championship.registrationStatus === 'open' || championship.registrationStatus === 'closing-soon'
  const baseFee = championship.pricing?.[0]?.fee || 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ y: -6 }}
      className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
    >
      <div className="relative h-44 lg:h-48 overflow-hidden">
        <img
          src={championship.banner || 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80'}
          alt={championship.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/10 to-transparent" />
        <div className="absolute top-3 left-3">
          <StatusBadge status={championship.registrationStatus} />
        </div>
        <div className="absolute bottom-3 left-3 right-3">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-xs font-semibold text-gray-800">
            <Users size={12} />
            {championship.eventCount || championship.selectedEvents?.length || 0} events
          </span>
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-base lg:text-lg font-bold text-[#0F172A] mb-3 line-clamp-2 leading-snug">
          {championship.name}
        </h3>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-xs lg:text-sm text-[#64748B]">
            <MapPin size={13} className="text-primary shrink-0" />
            <span className="truncate">{championship.venue}{championship.district ? `, ${championship.district}` : ''}</span>
          </div>
          <div className="flex items-center gap-2 text-xs lg:text-sm text-[#64748B]">
            <Calendar size={13} className="text-primary shrink-0" />
            <span>{championship.startDate} — {championship.endDate}</span>
          </div>
          {championship.regCloseDate && (
            <div className="flex items-center gap-2 text-xs lg:text-sm text-[#64748B]">
              <Clock size={13} className="text-primary shrink-0" />
              <span>Deadline: {championship.regCloseDate}</span>
            </div>
          )}
          {baseFee > 0 && (
            <div className="flex items-center gap-2 text-xs lg:text-sm text-[#64748B]">
              <DollarSign size={13} className="text-primary shrink-0" />
              <span>From <span className="font-semibold text-[#0F172A]">Rs. {baseFee.toLocaleString()}</span></span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to={`/championships/${championship.championship_id}`}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs lg:text-sm font-semibold text-primary border-2 border-primary/20 rounded-xl hover:bg-primary/5 hover:border-primary/40 transition-all duration-200"
          >
            View Details
            <ArrowRight size={14} />
          </Link>
          {isRegistrationOpen ? (
            <Link
              to={`/championships/${championship.championship_id}`}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs lg:text-sm font-semibold text-white bg-primary rounded-xl hover:bg-primary-dark transition-all duration-200 shadow-sm shadow-primary/20"
            >
              Register Now
              <ArrowRight size={14} />
            </Link>
          ) : (
            <span className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs lg:text-sm font-semibold text-gray-400 bg-gray-50 border border-gray-200 rounded-xl cursor-not-allowed">
              Registration Closed
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}
