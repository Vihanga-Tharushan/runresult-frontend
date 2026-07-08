import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Medal, ArrowRight } from 'lucide-react'

const results = [
  { championship: 'National Athletics Championships', event: '100m Sprint', position: '2nd', medal: 'Silver', result: '10.23s' },
  { championship: 'National Athletics Championships', event: '200m Sprint', position: '3rd', medal: 'Bronze', result: '20.87s' },
  { championship: 'International Track & Field Series', event: '4x100m Relay', position: '1st', medal: 'Gold', result: '39.12s' },
  { championship: 'International Track & Field Series', event: 'Long Jump', position: '4th', medal: '-', result: '7.82m' },
]

const medalColors = {
  Gold: 'text-yellow-500',
  Silver: 'text-gray-400',
  Bronze: 'text-amber-700',
}

export default function RecentResults() {
  return (
    <section className="py-12 lg:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-end justify-between mb-8 lg:mb-10"
        >
          <div>
            <span className="text-primary text-xs font-semibold uppercase tracking-widest">Performance</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] mt-1">
              Recent Results
            </h2>
          </div>
          <Link
            to="/results"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-dark transition-colors"
          >
            View All Results
            <ArrowRight size={15} />
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Championship', 'Event', 'Position', 'Medal', 'Result'].map((h) => (
                    <th key={h} className="text-left px-5 py-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {results.map((row, i) => (
                  <motion.tr
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.06 }}
                    className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-5 py-4 text-sm font-semibold text-[#0F172A] whitespace-nowrap">{row.championship}</td>
                    <td className="px-5 py-4 text-sm text-[#64748B] whitespace-nowrap">{row.event}</td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="text-sm font-bold text-[#0F172A]">{row.position}</span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      {row.medal === '-' ? (
                        <span className="text-sm text-[#64748B]">-</span>
                      ) : (
                        <span className={`inline-flex items-center gap-1 text-sm font-semibold ${medalColors[row.medal] || 'text-gray-600'}`}>
                          <Medal size={13} />
                          {row.medal}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm font-bold text-primary">{row.result}</span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-8 sm:hidden"
        >
          <Link
            to="/results"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all duration-200 shadow-sm text-sm"
          >
            View All Results
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
