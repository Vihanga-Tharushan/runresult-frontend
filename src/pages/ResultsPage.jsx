import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ChampionshipCard from '../components/results/ChampionshipCard'

const API = import.meta.env.VITE_API_URL

export default function ResultsPage() {
  const [championships, setChampionships] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get(API + '/api/championships')
      .then((res) => setChampionships(res.data.championships))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >

      {<Navbar />}

      <section className="pt-24 lg:pt-28 pb-8 lg:pb-10 bg-[#FCFCFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-3xl sm:text-4xl lg:text-3xl font-extrabold text-primary mt-2 ">
              Championship Results
            </h3>
            
          </motion.div>
        </div>
      </section>

      <section className="pb-12 lg:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
                  <div className="h-44 lg:h-48 bg-gray-200" />
                  <div className="p-5 space-y-3">
                    <div className="h-5 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                  </div>
                </div>
              ))
            ) : championships.length > 0 ? (
              championships.map((champ, i) => (
                <ChampionshipCard key={champ._id} championship={champ} index={i} />
              ))
            ) : (
              <p className="col-span-full text-center text-gray-400 py-10">No championships available yet.</p>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </motion.main>
  )
}
