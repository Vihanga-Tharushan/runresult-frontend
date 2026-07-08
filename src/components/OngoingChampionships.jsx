import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import AthleteChampionshipCard from './AthleteChampionshipCard'

const championships = [
  {
    id: 1,
    name: 'National Athletics Championships 2026',
    location: 'Sydney Olympic Park, Australia',
    date: '15 - 20 August 2026',
    deadline: '10 August 2026',
    fee: '$50.00',
    remainingSlots: 24,
    status: 'Ongoing',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80',
  },
  {
    id: 2,
    name: 'World Junior Swimming Trials',
    location: 'London Aquatics Centre, UK',
    date: '5 - 9 September 2026',
    deadline: '28 August 2026',
    fee: '$35.00',
    remainingSlots: 48,
    status: 'Upcoming',
    image: 'https://images.unsplash.com/photo-1530549387789-4c1017266634?w=600&q=80',
  },
  {
    id: 3,
    name: 'International Track & Field Series',
    location: 'National Stadium, Tokyo, Japan',
    date: '22 - 27 October 2026',
    deadline: '15 October 2026',
    fee: '$45.00',
    remainingSlots: 12,
    status: 'Ongoing',
    image: 'https://images.unsplash.com/photo-1461896836934-bd45ba8fcf9b?w=600&q=80',
  },
  {
    id: 4,
    name: 'Asian Athletics Grand Prix',
    location: 'Bukit Jalil Stadium, Kuala Lumpur',
    date: '12 - 14 November 2026',
    deadline: '5 November 2026',
    fee: '$40.00',
    remainingSlots: 35,
    status: 'Upcoming',
    image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=600&q=80',
  },
]

export default function OngoingChampionships() {
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
            <span className="text-primary text-xs font-semibold uppercase tracking-widest">Available</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] mt-1">
              Ongoing Championships
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

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {championships.map((champ, i) => (
            <AthleteChampionshipCard
              key={champ.id}
              championship={champ}
              index={i}
              registered={champ.id === 1}
            />
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
