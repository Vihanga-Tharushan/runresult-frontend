import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, Medal } from 'lucide-react'
import MedalBadge from './MedalBadge'
import ResultBadge from './ResultBadge'
import EventAccordion from './EventAccordion'
import ExportActions from './ExportActions'
import EmptyState from './EmptyState'

export default function FinalResultsTable({ finalData }) {
  const [searchQuery, setSearchQuery] = useState('')

  const events = finalData ? Object.values(finalData) : []

  const filteredEvents = useMemo(() => {
    if (!searchQuery.trim()) return events
    const q = searchQuery.toLowerCase()
    return events
      .map((event) => ({
        ...event,
        results: event.results.filter(
          (r) =>
            r.athlete.toLowerCase().includes(q) ||
            r.club.toLowerCase().includes(q) ||
            r.country.toLowerCase().includes(q) ||
            r.bib.toString().includes(q)
        ),
      }))
      .filter((event) => event.results.length > 0)
  }, [events, searchQuery])

  if (!finalData || Object.keys(finalData).length === 0) {
    return (
      <EmptyState
        icon="file"
        title="No Final Results Available"
        description="Final results have not been published yet for this championship."
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
            placeholder="Search athletes, clubs, or countries..."
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
            >
              <EventAccordion
                title={event.name}
                subtitle={`Final • ${event.date} • Wind: ${event.wind}`}
                defaultOpen={true}
              >
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50/80">
                        <th className="text-left px-4 lg:px-5 py-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Rank</th>
                        <th className="text-left px-4 lg:px-5 py-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Bib</th>
                        <th className="text-left px-4 lg:px-5 py-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Athlete</th>
                        <th className="text-left px-4 lg:px-5 py-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider hidden md:table-cell">Club</th>
                        <th className="text-left px-4 lg:px-5 py-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Performance</th>
                        <th className="text-left px-4 lg:px-5 py-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider hidden sm:table-cell">Wind</th>
                        <th className="text-left px-4 lg:px-5 py-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Medal</th>
                        <th className="text-left px-4 lg:px-5 py-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider hidden sm:table-cell">Records</th>
                      </tr>
                    </thead>
                    <tbody>
                      {event.results.map((r, ri) => (
                        <motion.tr
                          key={ri}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.2, delay: ri * 0.04 }}
                          className={`border-t border-gray-50 hover:bg-gray-50/50 transition-colors ${
                            r.rank === 1 ? 'bg-amber-50/30' : r.rank === 2 ? 'bg-gray-50/30' : r.rank === 3 ? 'bg-orange-50/20' : ''
                          }`}
                        >
                          <td className="px-4 lg:px-5 py-3">
                            <span className="text-sm font-extrabold text-[#0F172A]">{r.rank}</span>
                          </td>
                          <td className="px-4 lg:px-5 py-3 text-sm font-semibold text-primary">{r.bib}</td>
                          <td className="px-4 lg:px-5 py-3">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-[#0F172A] whitespace-nowrap">{r.athlete}</span>
                            </div>
                          </td>
                          <td className="px-4 lg:px-5 py-3 text-sm text-[#64748B] hidden md:table-cell whitespace-nowrap">{r.club}</td>
                          <td className="px-4 lg:px-5 py-3 text-sm text-[#64748B] hidden lg:table-cell">{r.country}</td>
                          <td className="px-4 lg:px-5 py-3">
                            <span className={`text-sm font-bold font-mono ${
                              r.performance === 'DNF' || r.performance === 'DQ' || r.performance === 'DNS'
                                ? 'text-red-500' : 'text-[#0F172A]'
                            }`}>
                              {r.performance}
                            </span>
                          </td>
                          <td className="px-4 lg:px-5 py-3 text-sm text-[#64748B] font-mono hidden sm:table-cell">{r.wind}</td>
                          <td className="px-4 lg:px-5 py-3">
                            {r.medal ? <MedalBadge type={r.medal} /> : <span className="text-xs text-[#64748B]">-</span>}
                          </td>
                          <td className="px-4 lg:px-5 py-3 hidden sm:table-cell">
                            <div className="flex items-center gap-1 flex-wrap">
                              {r.records && r.records.length > 0
                                ? r.records.map((rec) => <ResultBadge key={rec} type={rec} />)
                                : <span className="text-xs text-[#64748B]">-</span>
                              }
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </EventAccordion>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
