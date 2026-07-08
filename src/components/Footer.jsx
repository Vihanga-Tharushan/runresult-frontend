import { Trophy, Zap, BarChart3, ShieldCheck } from 'lucide-react'

const features = [
  {
    icon: Trophy,
    title: 'Fair Competition',
    description:
      'Ensuring equal opportunities and transparent standards for all athletes across every championship and event.',
  },
  {
    icon: Zap,
    title: 'Real-time Results',
    description:
      'Instant publishing and live updates of results so athletes and fans can follow every moment as it happens.',
  },
  {
    icon: BarChart3,
    title: 'Performance Tracking',
    description:
      'Comprehensive analytics and historical data to track athlete progress, records, and season performance.',
  },
  {
    icon: ShieldCheck,
    title: 'Trusted Platform',
    description:
      'Secure and reliable infrastructure trusted by sports organizations worldwide for managing competitions.',
  },
]

export default function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div key={feature.title} className="text-center lg:text-left">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mx-auto lg:mx-0 mb-4">
                  <Icon size={24} />
                </div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-sm text-white/70 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>

        <div className="mt-16 pt-8 border-t border-white/20 text-center">
          <p className="text-sm text-white/60">
            &copy; 2026 RUNRESULT. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
