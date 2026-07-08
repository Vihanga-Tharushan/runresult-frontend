import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { MapPin, Calendar, Clock, DollarSign, Users, ArrowRight, CheckCircle, AlertTriangle } from 'lucide-react'
import AthleteNavbar from '../components/AthleteNavbar'
import HeroBanner from '../components/HeroBanner'
import Footer from '../components/Footer'

const availableChamps = [
  {
    id: 'champ-4',
    name: 'Asian Athletics Grand Prix',
    location: 'Bukit Jalil Stadium, Kuala Lumpur',
    date: '12 - 14 November 2026',
    deadline: '5 November 2026',
    fee: '$40.00',
    remainingSlots: 35,
    status: 'Upcoming',
    image: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=600&q=80',
  },
  {
    id: 'champ-5',
    name: 'World Junior Swimming Trials',
    location: 'London Aquatics Centre, UK',
    date: '5 - 9 September 2026',
    deadline: '28 August 2026',
    fee: '$35.00',
    remainingSlots: 48,
    status: 'Upcoming',
    image: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=600&q=80',
  },
  {
    id: 'champ-6',
    name: 'Oceania Athletics Championships',
    location: 'ANZ Stadium, Fiji',
    date: '3 - 7 December 2026',
    deadline: '20 November 2026',
    fee: '$30.00',
    remainingSlots: 18,
    status: 'Upcoming',
    image: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=600&q=80',
  },
]

const registeredChamps = [
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
    id: 3,
    name: 'International Track & Field Series',
    date: '22 - 27 October 2026',
    regStatus: 'Pending Approval',
    paymentStatus: 'Unpaid',
    statusColor: 'text-amber-600 bg-amber-50 border-amber-200',
    icon: Clock,
  },
]

export default function AthleteDashboard() {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <AthleteNavbar />
      <HeroBanner />
      
    
      <Footer />
    </motion.main>
  )
}

function AvailableSection() {
  return (
    <section className="py-12 lg:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-end justify-between mb-8 lg:mb-10"
        >
          <div>
            <span className="text-primary text-xs font-semibold uppercase tracking-widest">
              Open for Registration
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] mt-1">
              Available Championships
            </h2>
          </div>
          <Link
            to="/championships"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-dark transition-colors"
          >
            View All
            <ArrowRight size={15} />
          </Link>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {availableChamps.map((champ, i) => (
            <motion.div
              key={champ.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -6 }}
              className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
            >
              <div className="relative h-44 lg:h-48 overflow-hidden">
                <img
                  src={champ.image}
                  alt={champ.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/10 to-transparent" />
                <span className="absolute top-3 left-3 px-3 py-1 text-xs font-semibold rounded-full shadow-sm bg-primary text-white">
                  {champ.status}
                </span>
                <div className="absolute bottom-3 left-3 right-3">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-xs font-semibold text-gray-800">
                    <Users size={12} />
                    {champ.remainingSlots} slots left
                  </span>
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-base lg:text-lg font-bold text-[#0F172A] mb-3 line-clamp-2 leading-snug">
                  {champ.name}
                </h3>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-xs lg:text-sm text-[#64748B]">
                    <MapPin size={13} className="text-primary shrink-0" />
                    <span className="truncate">{champ.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs lg:text-sm text-[#64748B]">
                    <Calendar size={13} className="text-primary shrink-0" />
                    <span>{champ.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs lg:text-sm text-[#64748B]">
                    <Clock size={13} className="text-primary shrink-0" />
                    <span>Deadline: {champ.deadline}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs lg:text-sm text-[#64748B]">
                    <DollarSign size={13} className="text-primary shrink-0" />
                    <span className="font-semibold text-[#0F172A]">{champ.fee}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <Link
                    to={`/championships/${champ.id}`}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs lg:text-sm font-semibold text-primary border-2 border-primary/20 rounded-xl hover:bg-primary/5 hover:border-primary/40 transition-all duration-200"
                  >
                    View Details
                    <ArrowRight size={14} />
                  </Link>
                  <Link
                    to={`/championships/${champ.id}`}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs lg:text-sm font-semibold text-white bg-primary rounded-xl hover:bg-primary-dark transition-all duration-200 shadow-sm shadow-primary/20"
                  >
                    Register Now
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-8 sm:hidden"
        >
          <Link
            to="/championships"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all duration-200 shadow-sm text-sm"
          >
            View All Championships
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

function RegisteredSection() {
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
            <span className="text-primary text-xs font-semibold uppercase tracking-widest">
              Registered
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] mt-1">
              My Championships
            </h2>
          </div>
          <Link
            to="/dashboard"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-dark transition-colors"
          >
            View All
            <ArrowRight size={15} />
          </Link>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-5 lg:gap-6">
          {registeredChamps.map((champ, i) => {
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
                  to={`/championships/reg-champ-${champ.id}`}
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
            to="/dashboard"
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

