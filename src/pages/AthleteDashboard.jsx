import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { MapPin, Calendar, Clock, DollarSign, Users, ArrowRight, CheckCircle, AlertTriangle } from 'lucide-react'
import AthleteNavbar from '../components/AthleteNavbar'
import HeroBanner from '../components/HeroBanner'
import Footer from '../components/Footer'



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


