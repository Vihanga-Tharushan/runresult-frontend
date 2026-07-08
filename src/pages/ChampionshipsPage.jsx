import { motion } from 'framer-motion'
import { Trophy } from 'lucide-react'
import AthleteNavbar from '../components/AthleteNavbar'
import Footer from '../components/Footer'
import ChampionshipCard from '../components/championships/ChampionshipCard'
import { registrationChampionships, userRegistrations } from '../data/registration'

export default function ChampionshipsPage() {
  const registeredIds = userRegistrations.map((r) => r.championshipId)

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
              {registrationChampionships.length} championship{registrationChampionships.length !== 1 ? 's' : ''} available for registration
            </p>
          </motion.div>
        </div>
      </section>

      <section className="pb-16 lg:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
            {registrationChampionships.map((champ, i) => (
              <ChampionshipCard
                key={champ.id}
                championship={champ}
                index={i}
                registered={registeredIds.includes(champ.id)}
              />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </motion.main>
  )
}
