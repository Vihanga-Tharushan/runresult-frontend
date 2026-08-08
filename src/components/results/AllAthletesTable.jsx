import { useState, useMemo, Fragment } from 'react'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import EventAccordion from './EventAccordion'
import EmptyState from './EmptyState'
import { flatEvents } from '../../data/adminData'

const eventName = (id) => {
  const found = flatEvents.find((e) => e.id === id)
  return found ? found.name : id
}

const resolveEventId = (value, championshipEvents) => {
  if (value === null || value === undefined || value === '') return value
  const idx = Number(value)
  if (!isNaN(idx) && championshipEvents && championshipEvents[idx]) return championshipEvents[idx]
  return value
}

export default function AllAthletesTable({ registrations, loading, championship }) {
  const [searchQuery, setSearchQuery] = useState('')

  const championshipEvents = championship?.selectedEvents || []

  const groups = useMemo(() => {
    return championshipEvents
      .map((eventId) => {
        const athletes = (registrations || [])
          .filter((r) =>
            (r.selectedEvents || []).some((e) => resolveEventId(e, championshipEvents) === eventId)
          )
          .map((r) => ({
            bib: r.bibNumber,
            name: r.fullName,
            district: r.address?.district,
            institution: r.institution,
            ageCategory: r.ageCategory,
          }))
          .sort((a, b) => (parseInt(a.bib) || 0) - (parseInt(b.bib) || 0))

        return { id: eventId, name: eventName(eventId), athletes }
      })
      .filter((g) => g.athletes.length > 0)
  }, [registrations, championshipEvents])

  const filteredGroups = useMemo(() => {
    if (!searchQuery.trim()) return groups
    const q = searchQuery.toLowerCase()
    return groups
      .map((group) => ({
        ...group,
        athletes: group.athletes.filter(
          (a) =>
            (a.name || '').toLowerCase().includes(q) ||
            (a.bib || '').toString().toLowerCase().includes(q) ||
            (a.district || '').toLowerCase().includes(q) ||
            (a.institution || '').toLowerCase().includes(q)
        ),
      }))
      .filter((group) => group.athletes.length > 0)
  }, [groups, searchQuery])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-primary rounded-full animate-spin" />
        <span className="text-sm font-medium text-[#64748B]">Loading athletes...</span>
      </div>
    )
  }

  if (groups.length === 0) {
    return (
      <EmptyState
        icon="file"
        title="No Registered Athletes Yet"
        description="No athletes have registered yet for this championship."
      />
    )
  }

  const ageCategoryGroups = (athletes) => {
    const map = {}
    athletes.forEach((a) => {
      const key = a.ageCategory || 'No Category'
      if (!map[key]) map[key] = []
      map[key].push(a)
    })
    return Object.entries(map)
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
            placeholder="Search athletes, schools, or districts..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-[#0F172A] placeholder:text-[#64748B] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-200"
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredGroups.length === 0 ? (
          <EmptyState
            icon="search"
            title="No Athletes Found"
            description="Try adjusting your search query."
          />
        ) : (
          filteredGroups.map((group, gi) => (
            <motion.div
              key={group.id || gi}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: gi * 0.06 }}
            >
              <EventAccordion
                title={group.name}
                subtitle={`${group.athletes.length} registered athlete${group.athletes.length !== 1 ? 's' : ''}`}
                defaultOpen={gi === 0}
              >
                {ageCategoryGroups(group.athletes).map(([ageCategory, athletes]) => (
                  <div key={ageCategory}>
                    <div className="flex items-center justify-between px-4 lg:px-5 py-2.5 bg-gray-50/60 border-t border-gray-100">
                      <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                        {ageCategory}
                      </span>
                      <span className="text-xs text-[#64748B]">
                        {athletes.length} athlete{athletes.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-50/80">
                            <th className="text-left px-4 lg:px-5 py-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Bib</th>
                            <th className="text-left px-4 lg:px-5 py-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Athlete</th>
                            <th className="text-left px-4 lg:px-5 py-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider hidden sm:table-cell">District</th>
                            <th className="text-left px-4 lg:px-5 py-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider hidden md:table-cell">School / Institute</th>
                          </tr>
                        </thead>
                        <tbody>
                          {athletes.map((a, ai) => (
                            <Fragment key={`${a.bib}-${ai}`}>
                              <motion.tr
                                initial={{ opacity: 0, x: -10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.2, delay: ai * 0.04 }}
                                className="hover:bg-gray-50/50 transition-colors"
                              >
                                <td className="px-4 lg:px-5 py-3 border-t border-gray-100 text-sm font-semibold text-primary">{a.bib}</td>
                                <td className="px-4 lg:px-5 py-3 border-t border-gray-100">
                                  <span className="text-sm font-semibold text-[#0F172A] whitespace-nowrap">{a.name}</span>
                                </td>
                                <td className="px-4 lg:px-5 py-3 border-t border-gray-100 text-sm text-[#64748B] hidden sm:table-cell whitespace-nowrap">{a.district || '-'}</td>
                                <td className="px-4 lg:px-5 py-3 border-t border-gray-100 text-sm text-[#64748B] hidden md:table-cell whitespace-nowrap">{a.institution || '-'}</td>
                              </motion.tr>
                              <tr className="md:hidden">
                                <td colSpan={4} className="px-4 py-2 border-t border-gray-100 bg-gray-50/40">
                                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
                                    {a.district && <span className="text-[#64748B]"><span className="font-semibold text-[#0F172A]">District:</span> {a.district}</span>}
                                    {a.institution && <span className="text-[#64748B]"><span className="font-semibold text-[#0F172A]">School:</span> {a.institution}</span>}
                                  </div>
                                </td>
                              </tr>
                            </Fragment>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </EventAccordion>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
