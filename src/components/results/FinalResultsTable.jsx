import { useState, useMemo, Fragment } from 'react'
import { motion } from 'framer-motion'
import { Search, Users } from 'lucide-react'
import MedalBadge from './MedalBadge'
import EventAccordion from './EventAccordion'
import EmptyState from './EmptyState'

export default function FinalResultsTable({ finalData, loading }) {
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
            r.bib.toString().includes(q) ||
            (r.members && r.members.some((m) => m.name.toLowerCase().includes(q)))
        ),
      }))
      .filter((event) => event.results.length > 0)
  }, [events, searchQuery])

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
            <div className="h-5 bg-gray-200 rounded w-1/3 mb-4" />
            <div className="space-y-3">
              {[1, 2, 3].map((j) => (
                <div key={j} className="h-4 bg-gray-100 rounded w-full" />
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

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
            placeholder="Search athletes, schools, or zones..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-[#0F172A] placeholder:text-[#64748B] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-200"
          />
        </div>
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
                title={`E: No: ${event.id} — ${event.name}`}
                subtitle={`${event.category} • ${event.date}`}
                defaultOpen={true}
              >
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50/80">
                        <th className="text-left px-4 lg:px-5 py-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Rank</th>
                        <th className="text-left px-4 lg:px-5 py-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Bib</th>
                        <th className="text-left px-4 lg:px-5 py-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Athlete</th>
                        <th className="text-left px-4 lg:px-5 py-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider hidden md:table-cell">School</th>
                        <th className="text-left px-4 lg:px-5 py-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider hidden lg:table-cell">Zone</th>
                        <th className="text-left px-4 lg:px-5 py-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Performance</th>
                        <th className="text-left px-4 lg:px-5 py-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider hidden sm:table-cell">Medal</th>
                        <th className="text-left px-4 lg:px-5 py-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider hidden sm:table-cell">Remarks</th>
                      </tr>
                    </thead>
                    <tbody>
                        {event.results.map((r, ri) => (
                          <Fragment key={ri}>
                            <motion.tr
                              initial={{ opacity: 0, x: -10 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.2, delay: ri * 0.04 }}
                              className={`hover:bg-gray-50/50 transition-colors ${
                                r.rank === 1 ? 'bg-amber-50/30' : r.rank === 2 ? 'bg-gray-50/30' : r.rank === 3 ? 'bg-orange-50/20' : ''
                              }`}
                            >
                              <td className="px-4 lg:px-5 py-3 border-t border-gray-100">
                                <span className="text-sm font-extrabold text-[#0F172A]">{r.rank}</span>
                              </td>
                              <td className="px-4 lg:px-5 py-3 border-t border-gray-100 text-sm font-semibold text-primary">{r.bib}</td>
                              <td className="px-4 lg:px-5 py-3 border-t border-gray-100">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-semibold text-[#0F172A] whitespace-nowrap">{r.athlete}</span>
                                  {r.members && r.members.length > 0 && (
                                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-primary/10 text-primary">
                                      <Users size={10} /> {r.members.length}
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="px-4 lg:px-5 py-3 border-t border-gray-100 text-sm text-[#64748B] hidden md:table-cell whitespace-nowrap">{r.club}</td>
                              <td className="px-4 lg:px-5 py-3 border-t border-gray-100 text-sm text-[#64748B] hidden lg:table-cell whitespace-nowrap">{r.country}</td>
                              <td className="px-4 lg:px-5 py-3 border-t border-gray-100">
                                <span className={`text-sm font-bold font-mono ${
                                  r.performance === 'DNF' || r.performance === 'DQ' || r.performance === 'DNS'
                                    ? 'text-red-500' : 'text-[#0F172A]'
                                }`}>
                                  {r.performance}
                                </span>
                              </td>
                              <td className="px-4 lg:px-5 py-3 border-t border-gray-100 hidden sm:table-cell">
                                {r.medal ? <MedalBadge type={r.medal} /> : <span className="text-xs text-[#64748B]">-</span>}
                              </td>
                              <td className="px-4 lg:px-5 py-3 border-t border-gray-100 hidden sm:table-cell">
                                {r.records && r.records.length > 0 ? (
                                  <div className="flex items-center gap-1 flex-wrap">
                                    {r.records.map((rec, i) => (
                                      <span key={i} className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                        {rec}
                                      </span>
                                    ))}
                                  </div>
                                ) : <span className="text-xs text-[#64748B]">-</span>}
                              </td>
                            </motion.tr>
                            {r.members && r.members.length > 0 && r.members.map((m, mi) => (
                              <tr key={`m-${ri}-${mi}`} className="bg-gray-50/40">
                                <td className="px-4 lg:px-5 py-1.5 border-t border-gray-50" />
                                <td className="px-4 lg:px-5 py-1.5 border-t border-gray-50 text-xs font-semibold text-primary/70">{m.bib}</td>
                                <td className="px-4 lg:px-5 py-1.5 border-t border-gray-50">
                                  <span className="text-xs text-[#64748B] pl-3">{m.name}</span>
                                </td>
                                <td className="px-4 lg:px-5 py-1.5 border-t border-gray-50 hidden md:table-cell" />
                                <td className="px-4 lg:px-5 py-1.5 border-t border-gray-50 hidden lg:table-cell" />
                                <td className="px-4 lg:px-5 py-1.5 border-t border-gray-50" />
                                <td className="px-4 lg:px-5 py-1.5 border-t border-gray-50 hidden sm:table-cell" />
                                <td className="px-4 lg:px-5 py-1.5 border-t border-gray-50 hidden sm:table-cell" />
                              </tr>
                            ))}
                          </Fragment>
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
