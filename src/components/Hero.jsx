import { motion } from 'framer-motion'
import { Trophy, User } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/run3.png' )`,
        }}
      >
       {/*left side gradient  */}
        <div className="absolute inset-0 bg-linear-to-r from-white/70 to-white/0"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 lg:pt-32 pb-16 lg:pb-20 w-full">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-primary mb-6">
              EVERY GAME 
              <br />
              RESULT INSTANTLY
            </h1>

            <p className="text-lg text-primary-dark/90 leading-relaxed mb-8 max-w-xl">
              Official platform for athletics championships.
              Register, compete and celebrate excellence.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/results"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-all duration-200 shadow-lg"
              >
                <Trophy size={18} />
                View Results
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-gray-100 transition-all duration-200 shadow-lg"
              >
                <User size={18} />
                Register Now
              </Link>
            </div>
          </motion.div>
        </div>

        
      </div>
    </section>
  )
}
