import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { Star, MapPin, Calendar, ArrowRight } from 'lucide-react'
import ChampionshipCard from './ChampionshipCard'

const dummyChampionships = [
  {
    id: 1,
    name: 'National Athletics Championships 2026',
    location: 'Sydney Olympic Park, Australia',
    date: '15 - 20 August 2026',
    status: 'Ongoing',
    description:
      'The premier athletics event of the year featuring top athletes from across the nation competing in track and field events.',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80',
  },
  {
    id: 2,
    name: 'World Junior Swimming Trials',
    location: 'London Aquatics Centre, UK',
    date: '5 - 9 September 2026',
    status: 'Ongoing',
    description:
      'Young swimming talents from around the globe compete for a spot in the upcoming World Junior Championships.',
    image: 'https://images.unsplash.com/photo-1530549387789-4c1017266634?w=600&q=80',
  },
  {
    id: 3,
    name: 'International Track & Field Series',
    location: 'National Stadium, Tokyo, Japan',
    date: '22 - 27 October 2026',
    status: 'Ongoing',
    description:
      'An elite series bringing together world-class athletes for head-to-head competition in multiple disciplines.',
    image: 'https://images.unsplash.com/photo-1461896836934-bd45ba8fcf9b?w=600&q=80',
  },
]

export default function Championships() {

  const navigate = useNavigate()

  return (
    <section className="py-20 lg:py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="text-primary text-sm font-semibold uppercase tracking-widest">
            Ongoing
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2 mb-6">
            CHAMPIONSHIPS
          </h2>
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="h-px w-16 bg-primary/30" />
            <Star size={16} className="text-primary" fill="#0342b3" />
            <span className="h-px w-16 bg-primary/30" />
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore and follow ongoing athletics championships. Stay updated
            with live results, schedules, and athlete performances.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {dummyChampionships.map((championship, index) => (
            <ChampionshipCard
              key={championship.id}
              championship={championship}
              index={index}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-12"
        >
          <button
            onClick={() => navigate('/results')}
            className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-white font-semibold rounded-full hover:bg-primary-dark transition-all duration-200 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
          >
            View All Championships
            <ArrowRight size={18} />
          </button>
        </motion.div>
      </div>
    </section>
  )
}

