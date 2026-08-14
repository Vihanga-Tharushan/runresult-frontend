import { useState, useMemo, Fragment } from 'react'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import EventAccordion from './EventAccordion'
import EmptyState from './EmptyState'

export default function StartListTable({ startListData, loading }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedEvent, setSelectedEvent] = useState('')
  const [eventNumber, setEventNumber] = useState('')

  const events = startListData ? Object.values(startListData) : []

  const eventNames = useMemo(() => [...new Set(events.map((e) => e.name))], [events])

  const filteredEvents = useMemo(() => {
    let result = events

    if (selectedEvent) {
      result = result.filter((e) => e.name === selectedEvent)
    }

    if (eventNumber.trim()) {
      result = result.filter((e) => String(e.eventNo || e.id).includes(eventNumber.trim()))
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result
        .map((event) => ({
          ...event,
          entries: event.entries.filter(
            (e) =>
              (e.athlete || '').toLowerCase().includes(q) ||
              (e.club || '').toLowerCase().includes(q) ||
              (e.bib || '').toString().includes(q)
          ),
        }))
        .filter((event) => event.entries.length > 0)
    }

    return result
  }, [events, searchQuery, selectedEvent, eventNumber])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-primary rounded-full animate-spin" />
        <span className="text-sm font-medium text-[#64748B]">Loading start lists...</span>
      </div>
    )
  }

  if (!startListData || Object.keys(startListData).length === 0) {
    return (
      <EmptyState
        icon="file"
        title="No Start Lists Available"
        description="Start lists have not been published yet for this championship."
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
            placeholder="Search by athlete or club..."
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
            >
              <EventAccordion
                title={`E No ${event.eventNo} — ${event.name} — ${event.round}`}
                subtitle={`${event.gender} • ${event.category} • ${event.entries.length} athletes`}
                defaultOpen={ei === 0}
              >
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50/80">
                        <th className="text-left px-4 lg:px-5 py-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Bib</th>
                        <th className="text-left px-4 lg:px-5 py-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Athlete Name</th>
                        <th className="text-left px-4 lg:px-5 py-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider hidden md:table-cell">Affiliate</th>
                        <th className="text-left px-4 lg:px-5 py-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider hidden lg:table-cell">Date of Birth</th>
                        <th className="text-left px-4 lg:px-5 py-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Lane Order</th>
                        <th className="text-left px-4 lg:px-5 py-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider hidden sm:table-cell">Remarks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {event.entries.map((entry, ii) => (
                        <Fragment key={entry.bib || ii}>
                          <motion.tr
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.2, delay: ii * 0.03 }}
                            className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors"
                          >
                            <td className="px-4 lg:px-5 py-3 text-sm font-semibold text-primary">{entry.bib}</td>
                            <td className="px-4 lg:px-5 py-3 text-sm font-semibold text-[#0F172A] whitespace-nowrap">{entry.athlete}</td>
                            <td className="px-4 lg:px-5 py-3 text-sm text-[#64748B] hidden md:table-cell whitespace-nowrap">{entry.club || '-'}</td>
                            <td className="px-4 lg:px-5 py-3 text-sm text-[#64748B] hidden lg:table-cell font-mono">
                              {entry.dob ? `${entry.dob.slice(0, 4)}-${entry.dob.slice(4, 6)}-${entry.dob.slice(6, 8)}` : '-'}
                            </td>
                            <td className="px-4 lg:px-5 py-3 text-sm font-bold text-[#0F172A]">{entry.lane}</td>
                            <td className="px-4 lg:px-5 py-3 text-sm text-[#64748B] hidden sm:table-cell">{entry.remarks || '-'}</td>
                          </motion.tr>
                          <tr className="md:hidden">
                            <td colSpan={6} className="px-4 py-2 border-t border-gray-100 bg-gray-50/40">
                              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
                                {entry.club && <span className="text-[#64748B]"><span className="font-semibold text-[#0F172A]">Affiliate:</span> {entry.club}</span>}
                                {entry.dob && <span className="text-[#64748B]"><span className="font-semibold text-[#0F172A]">DOB:</span> {`${entry.dob.slice(0, 4)}-${entry.dob.slice(4, 6)}-${entry.dob.slice(6, 8)}`}</span>}
                                {entry.remarks && <span className="text-[#64748B]"><span className="font-semibold text-[#0F172A]">Remarks:</span> {entry.remarks}</span>}
                              </div>
                            </td>
                          </tr>
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
