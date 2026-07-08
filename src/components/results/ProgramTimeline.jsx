import { useState } from 'react'
import { motion } from 'framer-motion'
import { Clock, ChevronDown, Filter } from 'lucide-react'

export default function ProgramTimeline({ program }) {
  const [openDay, setOpenDay] = useState(0)
  const [filters, setFilters] = useState({ gender: '', category: '' })

  if (!program || program.length === 0) {
    return (
      <div className="text-center py-12 text-[#64748B] text-sm">
        Program information is not yet available for this championship.
      </div>
    )
  }

  const filteredDays = program.map((day) => ({
    ...day,
    items: day.items.filter((item) => {
      if (filters.gender && item.gender !== filters.gender && item.gender !== '-') return false
      if (filters.category && item.category !== filters.category && item.category !== '-') return false
      return true
    }),
  }))

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        <div className="relative">
          <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B] pointer-events-none" />
          <select
            value={filters.gender}
            onChange={(e) => setFilters((f) => ({ ...f, gender: e.target.value }))}
            className="pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-sm text-[#0F172A] focus:outline-none focus:border-primary transition-colors appearance-none"
          >
            <option value="">All Genders</option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Mixed">Mixed</option>
          </select>
        </div>
        <div className="relative">
          <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B] pointer-events-none" />
          <select
            value={filters.category}
            onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}
            className="pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-sm text-[#0F172A] focus:outline-none focus:border-primary transition-colors appearance-none"
          >
            <option value="">All Categories</option>
            <option value="Senior">Senior</option>
            <option value="Junior">Junior</option>
            <option value="U20">U20</option>
            <option value="U18">U18</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredDays.map((day, di) => {
          const isOpen = openDay === di
          return (
            <motion.div
              key={di}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: di * 0.1 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
            >
              <button
                onClick={() => setOpenDay(isOpen ? -1 : di)}
                className="w-full flex items-center justify-between gap-4 px-5 py-4 lg:px-6 lg:py-4 hover:bg-gray-50/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">{day.day}</span>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-[#0F172A]">Day {day.day}</p>
                    <p className="text-xs text-[#64748B]">{day.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-[#64748B]">{day.items.length} events</span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown size={17} className="text-[#64748B]" />
                  </motion.div>
                </div>
              </button>

              {isOpen && (
                <div className="border-t border-gray-100">
                  <div className="divide-y divide-gray-50">
                    {day.items.length === 0 ? (
                      <div className="px-5 lg:px-6 py-6 text-center text-sm text-[#64748B]">
                        No events match the selected filters.
                      </div>
                    ) : (
                      day.items.map((item, ii) => (
                        <div
                          key={ii}
                          className="flex items-center gap-4 px-5 py-3 lg:px-6 lg:py-3.5 hover:bg-gray-50/50 transition-colors"
                        >
                          {item.time !== '-' ? (
                            <div className="flex items-center gap-1.5 w-16 shrink-0">
                              <Clock size={12} className="text-primary" />
                              <span className="text-xs font-semibold text-[#0F172A]">{item.time}</span>
                            </div>
                          ) : (
                            <div className="w-16 shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm ${item.event === 'Lunch Break' ? 'font-medium text-[#64748B] italic' : 'font-semibold text-[#0F172A]'}`}>
                              {item.event}
                            </p>
                          </div>
                          {item.gender !== '-' && (
                            <span className="text-[11px] font-medium text-[#64748B] bg-gray-50 px-2 py-0.5 rounded-md shrink-0">
                              {item.gender}
                            </span>
                          )}
                          {item.category !== '-' && (
                            <span className="text-[11px] font-medium text-[#64748B] bg-gray-50 px-2 py-0.5 rounded-md shrink-0 hidden sm:inline-block">
                              {item.category}
                            </span>
                          )}
                          <span className="text-[11px] font-semibold text-primary bg-primary/5 px-2 py-0.5 rounded-md shrink-0">
                            {item.round}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
