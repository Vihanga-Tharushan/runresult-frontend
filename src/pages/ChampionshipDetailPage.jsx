import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, MapPin, Users, Shield, FileText } from 'lucide-react'
import axios from 'axios'
import Navbar from '../components/Navbar'
import AthleteNavbar from '../components/AthleteNavbar'
import Footer from '../components/Footer'
import ChampionshipHeader from '../components/results/ChampionshipHeader'
import ResultTabs from '../components/results/ResultTabs'
import ProgramTimeline from '../components/results/ProgramTimeline'
import StartListTable from '../components/results/StartListTable'
import HeatResultsTable from '../components/results/HeatResultsTable'
import FinalResultsTable from '../components/results/FinalResultsTable'
import AllAthletesTable from '../components/results/AllAthletesTable'
import PointsTable from '../components/results/PointsTable'
import MedalsTable from '../components/results/MedalsTable'
import { PageSkeleton } from '../components/results/LoadingSkeleton'

const API = import.meta.env.VITE_API_URL

export default function ChampionshipDetailPage() {
  const { championshipId } = useParams()
  const [championship, setChampionship] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('final-results')
  const [user, setUser] = useState(null)
  const [finalResults, setFinalResults] = useState(null)
  const [finalResultsLoading, setFinalResultsLoading] = useState(false)
  const [heatResults, setHeatResults] = useState(null)
  const [heatResultsLoading, setHeatResultsLoading] = useState(false)
  const [startList, setStartList] = useState(null)
  const [startListLoading, setStartListLoading] = useState(false)
  const [athletes, setAthletes] = useState([])
  const [athletesLoading, setAthletesLoading] = useState(false)
  const [points, setPoints] = useState(null)
  const [pointsLoading, setPointsLoading] = useState(false)
  const [medals, setMedals] = useState(null)
  const [medalsLoading, setMedalsLoading] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      axios.get(API + '/api/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => setUser(res.data.user)).catch(() => {})
    }
  }, [])

  useEffect(() => {
    setLoading(true)
    axios.get(API + `/api/championships/${championshipId}`)
      .then((res) => setChampionship(res.data.championship))
      .catch(() => setChampionship(null))
      .finally(() => setLoading(false))
  }, [championshipId])

  useEffect(() => {
    if (!championship) return
    const sheets = championship.googleSheets || {}
    const hasFinalResults = sheets.finalResults?.connected && sheets.finalResults?.url
    if (!hasFinalResults) return

    setFinalResultsLoading(true)
    axios.get(API + `/api/results/final/${championship.championship_id}`)
      .then((res) => setFinalResults(res.data.events))
      .catch(() => setFinalResults(null))
      .finally(() => setFinalResultsLoading(false))
  }, [championship])

  useEffect(() => {
    if (!championship) return
    const sheets = championship.googleSheets || {}
    const hasHeatResults = sheets.heatResults?.connected && sheets.heatResults?.url
    if (!hasHeatResults) return

    setHeatResultsLoading(true)
    axios.get(API + `/api/results/heat/${championship.championship_id}`)
      .then((res) => setHeatResults(res.data.events))
      .catch(() => setHeatResults(null))
      .finally(() => setHeatResultsLoading(false))
  }, [championship])

  useEffect(() => {
    if (!championship) return
    const sheets = championship.googleSheets || {}
    const hasStartList = sheets.startList?.connected && sheets.startList?.url
    if (!hasStartList) return

    setStartListLoading(true)
    axios.get(API + `/api/results/startlist/${championship.championship_id}`)
      .then((res) => setStartList(res.data.events))
      .catch(() => setStartList(null))
      .finally(() => setStartListLoading(false))
  }, [championship])

  useEffect(() => {
    if (!championship) return

    setAthletesLoading(true)
    axios.get(API + `/api/registrations/championship/${championship.championship_id}`)
      .then((res) => setAthletes(res.data.registrations || []))
      .catch(() => setAthletes([]))
      .finally(() => setAthletesLoading(false))
  }, [championship])

  useEffect(() => {
    if (!championship) return
    const sheets = championship.googleSheets || {}
    const hasPoints = sheets.points?.connected && sheets.points?.url
    if (!hasPoints) return

    setPointsLoading(true)
    axios.get(API + `/api/results/points/${championship.championship_id}`)
      .then((res) => setPoints(res.data))
      .catch(() => setPoints(null))
      .finally(() => setPointsLoading(false))
  }, [championship])

  useEffect(() => {
    if (!championship) return
    const sheets = championship.googleSheets || {}
    const hasMedals = sheets.medals?.connected && sheets.medals?.url
    if (!hasMedals) return

    setMedalsLoading(true)
    axios.get(API + `/api/results/medals/${championship.championship_id}`)
      .then((res) => setMedals(res.data))
      .catch(() => setMedals(null))
      .finally(() => setMedalsLoading(false))
  }, [championship])

  const Nav = user?.role === 'athlete' ? AthleteNavbar : Navbar

  if (loading) {
    return (
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <Nav />
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
        <Nav />
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

  const program = championship.selectedEvents?.length
    ? [{ day: 1, date: championship.startDate, items: championship.selectedEvents.map((event, i) => ({
        time: '-',
        event,
        gender: '-',
        category: '-',
        round: 'Event',
      }))}]
    : []

  const sheets = championship.googleSheets || {}
  const hasFinalResults = sheets.finalResults?.connected && sheets.finalResults?.url
  const athleteCount = athletes.length || championship.athleteCount || 0

  const tabContent = {
    program: <ProgramTimeline program={program} />,
    'start-lists': <StartListTable startListData={startList} loading={startListLoading} />,
    'heat-results': <HeatResultsTable heatData={heatResults} loading={heatResultsLoading} />,
    'final-results': <FinalResultsTable finalData={finalResults} loading={finalResultsLoading} />,
    points: <PointsTable pointsData={points} loading={pointsLoading} />,
    medals: <MedalsTable medalsData={medals} loading={medalsLoading} />,
    'all-athletes': <AllAthletesTable registrations={athletes} loading={athletesLoading} championship={championship} />,
  }

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Nav />

      <div >
    
        <ChampionshipHeader championship={{ ...championship, athleteCount }} />

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
