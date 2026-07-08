import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, MapPin, Users, Shield, FileText } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ChampionshipHeader from '../components/results/ChampionshipHeader'
import ResultTabs from '../components/results/ResultTabs'
import ProgramTimeline from '../components/results/ProgramTimeline'
import StartListTable from '../components/results/StartListTable'
import HeatResultsTable from '../components/results/HeatResultsTable'
import FinalResultsTable from '../components/results/FinalResultsTable'
import { PageSkeleton } from '../components/results/LoadingSkeleton'
import { championships, programs, startLists, heatResults, finalResults } from '../data/results'

export default function ChampionshipDetailPage() {
  const { championshipId } = useParams()
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('program')

  const championship = championships.find((c) => c.id === championshipId)

  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => setLoading(false), 400)
    return () => clearTimeout(timer)
  }, [championshipId])

  if (loading) {
    return (
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <Navbar />
        <div className="pt-20 lg:pt-24">
          <PageSkeleton />
        </div>
        <Footer />
      </motion.main>
    )
  }

  if (!championship) {
    return (
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Navbar />
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center pt-20 lg:pt-24">
          <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-4">
            <FileText size={28} className="text-gray-300" />
          </div>
          <h2 className="text-xl font-bold text-[#0F172A] mb-1">Championship Not Found</h2>
          <p className="text-sm text-[#64748B] mb-6">The championship you are looking for does not exist.</p>
          <Link
            to="/results"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all duration-200 text-sm"
          >
            <ArrowLeft size={16} />
            Back to Results
          </Link>
        </div>
        <Footer />
      </motion.main>
    )
  }

  const tabContent = {
   
    program: <ProgramTimeline program={programs[championship.id]} />,
    'start-lists': <StartListTable startListData={startLists[championship.id]} />,
    'heat-results': <HeatResultsTable heatData={heatResults[championship.id]} />,
    'final-results': <FinalResultsTable finalData={finalResults[championship.id]} />,
  }

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Navbar />

      <div >
    
        <ChampionshipHeader championship={championship} />

        <section className="py-8 lg:py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ResultTabs activeTab={activeTab} onTabChange={setActiveTab} />

            <div className="mt-8 lg:mt-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  {tabContent[activeTab]}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </motion.main>
  )
}

function OverviewTab({ championship }) {
  return (
    <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 lg:p-8 shadow-sm">
          <h3 className="text-lg font-bold text-[#0F172A] mb-3">About the Championship</h3>
          <p className="text-sm text-[#64748B] leading-relaxed">{championship.description}</p>
        </div>

       

        <div className="bg-white rounded-2xl border border-gray-100 p-6 lg:p-8 shadow-sm">
          <h3 className="text-lg font-bold text-[#0F172A] mb-4">Important Notices</h3>
          <div className="space-y-3">
            {championship.notices.map((notice, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-amber-50/50 rounded-xl border border-amber-100/50">
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 shrink-0" />
                <p className="text-sm text-[#64748B] leading-relaxed">{notice}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-6">

        <div className="bg-white rounded-2xl border border-gray-100 p-6 lg:p-8 shadow-sm">
          <h3 className="text-lg font-bold text-[#0F172A] mb-4">Championship Officials</h3>
          <div className="space-y-4">
            {championship.officials.map((official, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/5 flex items-center justify-center shrink-0">
                  <Shield size={16} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#0F172A]">{official.name}</p>
                  <p className="text-xs text-[#64748B]">{official.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
