import { useState, useMemo, Fragment } from 'react'
import { motion } from 'framer-motion'
import { Search, Users } from 'lucide-react'
import MedalBadge from './MedalBadge'
import EventAccordion from './EventAccordion'
import EmptyState from './EmptyState'

export default function FinalResultsTable({ finalData, loading, format = 'normal' }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedEvent, setSelectedEvent] = useState('')
  const [eventNumber, setEventNumber] = useState('')

  const events = finalData ? Object.values(finalData) : []

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
          results: event.results.filter(
            (r) =>
              r.athlete.toLowerCase().includes(q) ||
              r.club.toLowerCase().includes(q) ||
              r.country.toLowerCase().includes(q) ||
              r.bib.toString().includes(q) ||
              (r.serviceNumber && r.serviceNumber.toLowerCase().includes(q)) ||
              (r.rankTitle && r.rankTitle.toLowerCase().includes(q)) ||
              (r.members && r.members.some((m) => m.name.toLowerCase().includes(q)))
          ),
        }))
        .filter((event) => event.results.length > 0)
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

  if (!finalData || Object.keys(finalData).length === 0) {
    return (
      <EmptyState
        icon="file"
        title="No Final Results Available"
        description="Final results have not been published yet for this championship."
      />
    )
  }

  const isArmy = format === 'army'
  const showZone = format !== 'withoutZone' && !isArmy

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B] pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isArmy ? 'Search names, regiments...' : 'Search athletes, schools, or zones...'}
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
                title={`E: No: ${event.id} — ${event.name} — ${event.category}`}
                subtitle={event.date}
                defaultOpen={true}
              >
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50/80">
                        <th className="text-left px-4 lg:px-5 py-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">{isArmy ? 'Place' : 'Rank'}</th>
                        <th className="text-left px-4 lg:px-5 py-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">{isArmy ? 'BIB' : 'Bib'}</th>
                        {isArmy && <th className="text-left px-4 lg:px-5 py-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider hidden lg:table-cell">Service No</th>}
                        {isArmy && <th className="text-left px-4 lg:px-5 py-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider hidden md:table-cell">Rank</th>}
                        <th className="text-left px-4 lg:px-5 py-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">{isArmy ? 'Name' : 'Athlete'}</th>
                        {!isArmy && <th className="text-left px-4 lg:px-5 py-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider hidden md:table-cell">Company/Affiliate:</th>}
                        {showZone && <th className="text-left px-4 lg:px-5 py-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider hidden lg:table-cell">Zone</th>}
                        {isArmy && <th className="text-left px-4 lg:px-5 py-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider hidden md:table-cell">Regiment</th>}
                        <th className="text-left px-4 lg:px-5 py-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Performance</th>
                        <th className="text-left px-4 lg:px-5 py-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider hidden sm:table-cell">Remarks</th>
                        <th className="text-left px-4 lg:px-5 py-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider hidden sm:table-cell">Medal</th>
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
                              {isArmy && <td className="px-4 lg:px-5 py-3 border-t border-gray-100 text-sm text-[#64748B] hidden lg:table-cell whitespace-nowrap">{r.serviceNumber}</td>}
                              {isArmy && <td className="px-4 lg:px-5 py-3 border-t border-gray-100 text-sm text-[#64748B] hidden md:table-cell whitespace-nowrap">{r.rankTitle}</td>}
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
                              {!isArmy && <td className="px-4 lg:px-5 py-3 border-t border-gray-100 text-sm text-[#64748B] hidden md:table-cell whitespace-nowrap">{r.club}</td>}
                              {showZone && <td className="px-4 lg:px-5 py-3 border-t border-gray-100 text-sm text-[#64748B] hidden lg:table-cell whitespace-nowrap">{r.country}</td>}
                              {isArmy && <td className="px-4 lg:px-5 py-3 border-t border-gray-100 text-sm text-[#64748B] hidden md:table-cell whitespace-nowrap">{r.club}</td>}
                              <td className="px-4 lg:px-5 py-3 border-t border-gray-100">
                                <span className={`text-sm font-bold font-mono ${
                                  r.performance === 'DNF' || r.performance === 'DQ' || r.performance === 'DNS'
                                    ? 'text-red-500' : 'text-[#0F172A]'
                                }`}>
                                  {r.performance}
                                </span>
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
                               <td className="px-4 lg:px-5 py-3 border-t border-gray-100 hidden sm:table-cell">
                                {r.medal ? <MedalBadge type={r.medal} /> : <span className="text-xs text-[#64748B]">-</span>}
                              </td>
                            </motion.tr>
                            <tr className="md:hidden">
                              <td colSpan={8} className="px-4 py-2 border-t border-gray-100 bg-gray-50/40">
                                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
                                  {isArmy && r.serviceNumber && <span className="text-[#64748B]"><span className="font-semibold text-[#0F172A]">Service No:</span> {r.serviceNumber}</span>}
                                  {isArmy && r.rankTitle && <span className="text-[#64748B]"><span className="font-semibold text-[#0F172A]">Rank:</span> {r.rankTitle}</span>}
                                  {!isArmy && r.club && <span className="text-[#64748B]"><span className="font-semibold text-[#0F172A]">Company/Affiliate:</span> {r.club}</span>}
                                  {isArmy && r.club && <span className="text-[#64748B]"><span className="font-semibold text-[#0F172A]">Regiment:</span> {r.club}</span>}
                                  {showZone && r.country && <span className="text-[#64748B]"><span className="font-semibold text-[#0F172A]">Zone:</span> {r.country}</span>}
                                  {r.medal && <span className="flex items-center gap-1"><span className="font-semibold text-[#0F172A]">Medal:</span> <MedalBadge type={r.medal} /></span>}
                                  {r.records && r.records.length > 0 && (
                                    <span className="flex items-center gap-1 flex-wrap">
                                      <span className="font-semibold text-[#0F172A]">Remarks:</span>
                                      {r.records.map((rec, i) => (
                                        <span key={i} className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                          {rec}
                                        </span>
                                      ))}
                                    </span>
                                  )}
                                </div>
                              </td>
                            </tr>
                            {r.members && r.members.length > 0 && r.members.map((m, mi) => (
                              <tr key={`m-${ri}-${mi}`} className="bg-gray-50/40">
                                <td className="px-4 lg:px-5 py-1.5 border-t border-gray-50" />
                                <td className="px-4 lg:px-5 py-1.5 border-t border-gray-50 text-xs font-semibold text-primary/70">{m.bib}</td>
                                {isArmy && <td className="px-4 lg:px-5 py-1.5 border-t border-gray-50 hidden lg:table-cell" />}
                                {isArmy && <td className="px-4 lg:px-5 py-1.5 border-t border-gray-50 hidden md:table-cell" />}
                                <td className="px-4 lg:px-5 py-1.5 border-t border-gray-50">
                                  <span className="text-xs text-[#64748B] pl-3">{m.name}</span>
                                </td>
                                {!isArmy && <td className="px-4 lg:px-5 py-1.5 border-t border-gray-50 hidden md:table-cell" />}
                                {showZone && <td className="px-4 lg:px-5 py-1.5 border-t border-gray-50 hidden lg:table-cell" />}
                                {isArmy && <td className="px-4 lg:px-5 py-1.5 border-t border-gray-50 hidden md:table-cell" />}
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
