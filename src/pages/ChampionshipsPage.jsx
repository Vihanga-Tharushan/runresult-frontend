import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'
import AthleteNavbar from '../components/AthleteNavbar'
import Footer from '../components/Footer'
import ChampionshipCard from '../components/championships/ChampionshipCard'

const API = import.meta.env.VITE_API_URL

export default function ChampionshipsPage() {
  const [championships, setChampionships] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get(API + '/api/championships')
      .then((res) => {
        const available = res.data.championships.filter(
          (c) => c.registrationStatus !== 'draft' && c.registrationStatus !== 'closed'
        )
        setChampionships(available)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <AthleteNavbar />

      <section className="pt-24 lg:pt-28 pb-8 lg:pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0F172A]">
              Championships
            </h1>
            <p className="text-sm text-[#64748B] mt-1">
              {loading ? 'Loading...' : `${championships.length} championship${championships.length !== 1 ? 's' : ''} available for registration`}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="pb-16 lg:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
                  <div className="h-44 lg:h-48 bg-gray-200" />
                  <div className="p-5 space-y-3">
                    <div className="h-5 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : championships.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
              {championships.map((champ, i) => (
                <ChampionshipCard
                  key={champ._id}
                  championship={champ}
                  index={i}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-sm text-[#64748B]">No championships available for registration right now.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </motion.main>
  )
}
