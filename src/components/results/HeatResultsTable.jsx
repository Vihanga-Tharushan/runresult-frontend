import { useState, useMemo, Fragment } from 'react'
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
                    <th className="text-left px-4 lg:px-5 py-2.5 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Bib</th>
                    <th className="text-left px-4 lg:px-5 py-2.5 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Athlete</th>
                    <th className="text-left px-4 lg:px-5 py-2.5 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider hidden md:table-cell">Affiliate</th>

                    <th className="text-left px-4 lg:px-5 py-2.5 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Performance</th>
                    <th className="text-left px-4 lg:px-5 py-2.5 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider hidden lg:table-cell">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {heat.results.map((r, ri) => (
                    <Fragment key={ri}>
                      <motion.tr
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: ri * 0.03 }}
                        className={`border-t border-gray-50 hover:bg-gray-50/50 transition-colors ${r.rank <= 3 ? 'bg-blue-50/20' : ''}`}
                      >
                        <td className="px-4 lg:px-5 py-3 text-sm font-bold text-[#0F172A]">{r.rank}</td>
                        <td className="px-4 lg:px-5 py-3 text-sm font-semibold text-primary">{r.bib}</td>
                        <td className="px-4 lg:px-5 py-3 text-sm font-semibold text-[#0F172A] whitespace-nowrap">{r.athlete}</td>
                        <td className="px-4 lg:px-5 py-3 text-sm text-[#64748B] whitespace-nowrap hidden md:table-cell">{r.affiliate || '-'}</td>
                        
                        <td className="px-4 lg:px-5 py-3 text-sm font-bold text-[#0F172A] font-mono">{r.time}</td>
                        <td className="px-4 lg:px-5 py-3 text-sm text-[#64748B] font-mono hidden lg:table-cell">{r.remarks || '-'}</td>
                       
                      </motion.tr>
                      <tr className="md:hidden">
                        <td colSpan={8} className="px-4 py-2 border-t border-gray-100 bg-gray-50/40">
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
                            {r.affiliate && <span className="text-[#64748B]"><span className="font-semibold text-[#0F172A]">Affiliate:</span> {r.affiliate}</span>}
                            {r.dob && <span className="text-[#64748B]"><span className="font-semibold text-[#0F172A]">DOB:</span> {`${r.dob.slice(0, 4)}-${r.dob.slice(4, 6)}-${r.dob.slice(6, 8)}`}</span>}
                            {r.remarks && <span className="text-[#64748B]"><span className="font-semibold text-[#0F172A]">Remarks:</span> {r.remarks}</span>}
                          </div>
                        </td>
                      </tr>
                    </Fragment>
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

export default function HeatResultsTable({ heatData, loading }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedEvent, setSelectedEvent] = useState('')
  const [eventNumber, setEventNumber] = useState('')

  const events = heatData ? Object.values(heatData) : []

  const eventNames = useMemo(() => [...new Set(events.map((e) => e.name))], [events])

  const filteredEvents = useMemo(() => {
    let result = events

    if (selectedEvent) {
      result = result.filter((e) => e.name === selectedEvent)
    }

    if (eventNumber.trim()) {
      result = result.filter((e) => String(e.id).includes(eventNumber.trim()))
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result
        .map((event) => ({
          ...event,
          heats: (event.heats || [])
            .map((heat) => ({
              ...heat,
              results: (heat.results || []).filter(
                (r) =>
                  (r.athlete || '').toLowerCase().includes(q) ||
                  (r.affiliate || '').toLowerCase().includes(q) ||
                  String(r.bib).toLowerCase().includes(q)
              ),
            }))
            .filter((heat) => heat.results.length > 0),
        }))
        .filter((event) => (event.heats || []).length > 0)
    }

    return result
  }, [events, searchQuery, selectedEvent, eventNumber])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-primary rounded-full animate-spin" />
        <span className="text-sm font-medium text-[#64748B]">Loading results...</span>
      </div>
    )
  }

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
        <select
          value={selectedEvent}
          onChange={(e) => setSelectedEvent(e.target.value)}
          className="w-full sm:w-56 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-[#0F172A] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-200"
        >
          <option value="">All Events</option>
          {eventNames.map((name) => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
        <input
          type="number"
          value={eventNumber}
          onChange={(e) => setEventNumber(e.target.value)}
          placeholder="Event No."
          className="w-full sm:w-36 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-[#0F172A] placeholder:text-[#64748B] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-200"
        />
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
                <h3 className="text-sm lg:text-base font-bold text-[#0F172A]">
                  <span className="text-primary">E: No: {event.id}</span> — {event.name}
                </h3>
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
