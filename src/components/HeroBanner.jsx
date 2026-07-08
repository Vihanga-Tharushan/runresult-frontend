import { motion } from 'framer-motion'
import { Trophy, ShieldCheck, BarChart3, ArrowRight, ListChecks } from 'lucide-react'
import { Link } from 'react-router-dom'

const features = [
  {
    icon: Trophy,
    title: 'Register for Championships',
    desc: 'Browse and sign up for upcoming athletics events.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Payments',
    desc: 'Pay registration fees safely through our platform.',
  },
  {
    icon: BarChart3,
    title: 'View Results',
    desc: 'Access your performance data and race results.',
  },
]

export default function HeroBanner() {
  return (
    <section className="relative min-h-[90vh] lg:min-h-screen flex items-center overflow-hidden bg-linear-to-br from-blue-50/50 via-white to-white pt-20 lg:pt-24">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-10 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
           

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F172A] leading-tight mb-4">
              Welcome back,<br />
              <span className="text-primary">John Silva</span>
              <span className="inline-block animate-wave origin-[70%_70%] ml-1">👋</span>
            </h1>

            <p className="text-base sm:text-lg text-[#64748B] leading-relaxed mb-8 max-w-lg">
              Ready to compete, improve your performance, and achieve your next personal best.
            </p>

            <div className="grid sm:grid-cols-3 gap-3 mb-8">
              {features.map((f) => {
                const Icon = f.icon
                return (
                  <div
                    key={f.title}
                    className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <div className="w-9 h-9 rounded-lg bg-primary/5 flex items-center justify-center mb-2.5">
                      <Icon size={17} className="text-primary" />
                    </div>
                    <h3 className="text-sm font-bold text-[#0F172A] mb-0.5">{f.title}</h3>
                    <p className="text-xs text-[#64748B] leading-relaxed">{f.desc}</p>
                  </div>
                )
              })}
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/athlete/championships"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all duration-200 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 text-sm"
              >
                Explore Championships
                <ArrowRight size={17} />
              </Link>
              
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-linear-to-br from-primary/5 via-primary/10 to-transparent rounded-4xl blur-2xl" />
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-linear-to-tl from-primary/30 via-primary/10 to-transparent z-10" />
                <img
                  src="https://media.gettyimages.com/id/pha156000069/photo/male-runners-at-start-of-race-close-up.jpg?s=612x612&w=0&k=20&c=HWsoG4_HIsk8WrYVZpI38AToeZTC4EadYSbay86KJWc="
                  alt="Athlete sprinting on track"
                  className="w-full h-130 object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-white/30 to-transparent z-10" />
              </div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
