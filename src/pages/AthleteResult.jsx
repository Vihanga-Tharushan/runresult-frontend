import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ChampionshipCard from '../components/results/ChampionshipCard'
import SearchFilters from '../components/results/SearchFilters'
import { championships } from '../data/results'
import AthleteNavbar from '../components/AthleteNavbar'
import { useLocation } from 'react-router-dom'

export default function AthleteResults() {


  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >

      {<AthleteNavbar />}

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
            {championships.map((champ, i) => (
              <ChampionshipCard key={champ.id} championship={champ} index={i} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </motion.main>
  )
}
