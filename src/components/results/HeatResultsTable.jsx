import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, ChevronDown } from 'lucide-react'
import { AnimatePresence } from 'framer-motion'
import ResultBadge from './ResultBadge'
import ExportActions from './ExportActions'
import EmptyState from './EmptyState'

function HeatAccordion({ heat, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-gray-50 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-3 px-4 lg:px-5 py-3 hover:bg-gray-50/50 transition-colors"
      >
        <span className="text-sm font-bold text-[#0F172A]">{heat.name}</span>
        <div className="flex items-center gap-3">
          <span className="text-xs text-[#64748B]">{heat.results.length} athletes</span>
          <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown size={15} className="text-[#64748B]" />
          </motion.div>
        </div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="overflow-x-auto border-t border-gray-50">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50/80">
                    <th className="text-left px-4 lg:px-5 py-2.5 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Rank</th>
                    <th className="text-left px-4 lg:px-5 py-2.5 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Lane</th>
                    <th className="text-left px-4 lg:px-5 py-2.5 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Bib</th>
                    <th className="text-left px-4 lg:px-5 py-2.5 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Athlete</th>
                    <th className="text-left px-4 lg:px-5 py-2.5 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Time</th>
                    <th className="text-left px-4 lg:px-5 py-2.5 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider hidden sm:table-cell">Wind</th>
                    <th className="text-left px-4 lg:px-5 py-2.5 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {heat.results.map((r, ri) => (
                    <motion.tr
                      key={ri}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: ri * 0.03 }}
                      className={`border-t border-gray-50 hover:bg-gray-50/50 transition-colors ${r.rank <= 3 ? 'bg-blue-50/20' : ''}`}
                    >
                      <td className="px-4 lg:px-5 py-3 text-sm font-bold text-[#0F172A]">{r.rank}</td>
                      <td className="px-4 lg:px-5 py-3 text-sm text-[#64748B] font-mono">{r.lane}</td>
                      <td className="px-4 lg:px-5 py-3 text-sm font-semibold text-primary">{r.bib}</td>
                      <td className="px-4 lg:px-5 py-3 text-sm font-semibold text-[#0F172A] whitespace-nowrap">{r.athlete}</td>
                      <td className="px-4 lg:px-5 py-3 text-sm font-bold text-[#0F172A] font-mono">{r.time}</td>
                      <td className="px-4 lg:px-5 py-3 text-sm text-[#64748B] font-mono hidden sm:table-cell">{r.wind}</td>
                      <td className="px-4 lg:px-5 py-3">
                        {r.status ? <ResultBadge type={r.status} /> : <span className="text-xs text-[#64748B]">-</span>}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function HeatResultsTable({ heatData }) {
  const [searchQuery, setSearchQuery] = useState('')

  const events = heatData ? Object.values(heatData) : []

  const filteredEvents = useMemo(() => {
    if (!searchQuery.trim()) return events
    const q = searchQuery.toLowerCase()
    return events
      .map((event) => ({
        ...event,
        heats: event.heats
          .map((heat) => ({
            ...heat,
            results: heat.results.filter(
              (r) =>
                r.athlete.toLowerCase().includes(q) ||
                r.bib.toString().includes(q)
            ),
          }))
          .filter((heat) => heat.results.length > 0),
      }))
      .filter((event) => event.heats.length > 0)
  }, [events, searchQuery])

  if (!heatData || Object.keys(heatData).length === 0) {
    return (
      <EmptyState
        icon="file"
        title="No Heat Results Available"
        description="Heat results have not been published yet for this championship."
      />
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B] pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by athlete or bib..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-[#0F172A] placeholder:text-[#64748B] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-200"
          />
        </div>
        <ExportActions />
      </div>

      <div className="space-y-4">
        {filteredEvents.length === 0 ? (
          <EmptyState icon="search" title="No Results Found" description="Try adjusting your search query." />
        ) : (
          filteredEvents.map((event, ei) => (
            <motion.div
              key={event.id || ei}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: ei * 0.06 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
            >
              <div className="px-4 lg:px-5 py-3.5 lg:py-4 border-b border-gray-100">
                <h3 className="text-sm lg:text-base font-bold text-[#0F172A]">{event.name}</h3>
                <p className="text-xs text-[#64748B] mt-0.5">{event.gender} • {event.category}</p>
              </div>
              {event.heats.map((heat, hi) => (
                <HeatAccordion key={hi} heat={heat} defaultOpen={hi === 0} />
              ))}
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
