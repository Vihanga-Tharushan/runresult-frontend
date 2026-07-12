import { motion } from 'framer-motion'
import { MapPin, Calendar, Clock, DollarSign, Trophy, Building2, ChevronLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import StatusBadge from './StatusBadge'

export default function ChampionshipHero({ championship }) {
  return (
    <section className="relative min-h-[50vh] lg:min-h-[55vh] flex items-end">
      <div className="absolute inset-0">
        <img
          src={championship.banner || 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&q=80'}
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/50 to-black/30" />
      </div>

      <div className="relative w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 lg:pb-12">
          <Link
            to="/athlete/championships"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-white/70 hover:text-white transition-colors mb-4 lg:mb-6"
          >
            <ChevronLeft size={16} />
            Back to Championships
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col lg:flex-row lg:items-end gap-6 lg:gap-8"
          >
            <div className="w-20 h-20 lg:w-28 lg:h-28 rounded-2xl overflow-hidden bg-white/90 backdrop-blur-sm p-2 shadow-lg shrink-0">
              <img
                src={championship.logo || 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=200&q=80'}
                alt=""
                className="w-full h-full object-contain rounded-xl"
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <StatusBadge status={championship.status || championship.registrationStatus} size="md" />
                <span className="text-sm font-medium text-white/70">{championship.organizer}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight mb-3">
                {championship.name}
              </h1>

              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/80">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin size={14} />
                  {championship.venue}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Calendar size={14} />
                  {championship.startDate} — {championship.endDate}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock size={14} />
                  Deadline: {championship.deadline}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <DollarSign size={14} />
                  From Rs. {championship.baseFee.toLocaleString()}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
