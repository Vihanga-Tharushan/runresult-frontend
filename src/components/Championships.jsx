import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Star, ArrowRight } from 'lucide-react'
import axios from 'axios'
import ChampionshipCard from './ChampionshipCard'

const API = import.meta.env.VITE_API_URL

export default function Championships() {
  const [championships, setChampionships] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    axios.get(API + '/api/championships')
      .then((res) => {
        setChampionships(res.data.championships.slice(0, 3))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

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
          {loading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="bg-surface rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                </div>
              </div>
            ))
          ) : championships.length > 0 ? (
            championships.map((championship, index) => (
              <ChampionshipCard
                key={championship._id}
                championship={championship}
                index={index}
              />
            ))
          ) : (
            <p className="col-span-3 text-center text-gray-400 py-10">No championships available yet.</p>
          )}
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

