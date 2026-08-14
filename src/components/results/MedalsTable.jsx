import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, Trophy, Medal } from 'lucide-react'
import EmptyState from './EmptyState'

function MedalCell({ type, value }) {
  const config = {
    Gold: { emoji: '🥇', text: 'text-yellow-500' },
    Silver: { emoji: '🥈', text: 'text-gray-400' },
    Bronze: { emoji: '🥉', text: 'text-amber-700' },
  }
  const c = config[type]
  return (
    <span className={`inline-flex items-center gap-1.5 font-bold text-sm ${c.text}`}>
      <span className="text-base leading-none">{c.emoji}</span>
      {value}
    </span>
  )
}

export default function MedalsTable({ medalsData, loading }) {
  const [activeSection, setActiveSection] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const sections = useMemo(() => medalsData?.sections || [], [medalsData])
  const current = sections.find((s) => s.name === activeSection) || sections[0] || null

  const filteredRows = useMemo(() => {
    if (!current) return []
    if (!searchQuery.trim()) return current.rows
    const q = searchQuery.toLowerCase()
    return current.rows.filter((r) => r.name?.toLowerCase().includes(q))
  }, [current, searchQuery])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-primary rounded-full animate-spin" />
        <span className="text-sm font-medium text-[#64748B]">Loading medals...</span>
      </div>
    )
  }

  if (!medalsData || sections.length === 0) {
    return (
      <EmptyState
        icon="file"
        title="No Medals Available"
        description="Medal tallies have not been published yet for this championship."
      />
    )
  }

  const totals = filteredRows.reduce(
    (acc, r) => {
      acc.gold += r.gold
      acc.silver += r.silver
      acc.bronze += r.bronze
      acc.total += r.total ?? r.gold + r.silver + r.bronze
      return acc
    },
    { gold: 0, silver: 0, bronze: 0, total: 0 }
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex rounded-xl border border-gray-200 bg-white p-1 overflow-x-auto">
          {sections.map((section) => (
            <button
              key={section.name}
              onClick={() => setActiveSection(section.name)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                current?.name === section.name ? 'bg-primary text-white' : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              {section.name}
            </button>
          ))}
        </div>
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B] pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search teams..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-[#0F172A] placeholder:text-[#64748B] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-200"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 lg:px-6 border-b border-gray-100">
          <div className="w-9 h-9 rounded-lg bg-primary/5 flex items-center justify-center shrink-0">
            <Medal size={16} className="text-primary" />
          </div>
          <div>
            <h3 className="text-sm lg:text-base font-bold text-[#0F172A]">{current?.name} Medal Tally</h3>
            <p className="text-xs text-[#64748B]">
              {filteredRows.length} of {current?.rows.length || 0} teams
            </p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/80">
                <th className="text-left px-4 lg:px-5 py-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Place</th>
                <th className="text-left px-4 lg:px-5 py-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Team</th>
                <th className="text-center px-4 lg:px-5 py-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Gold</th>
                <th className="text-center px-4 lg:px-5 py-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Silver</th>
                <th className="text-center px-4 lg:px-5 py-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Bronze</th>
                <th className="text-center px-4 lg:px-5 py-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Total</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-sm text-[#64748B]">
                    No matching teams found.
                  </td>
                </tr>
              ) : filteredRows.map((row, ri) => (
                <motion.tr
                  key={row.name || ri}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.2, delay: ri * 0.03 }}
                  className={`border-t border-gray-100 hover:bg-gray-50/50 transition-colors ${[1, 2, 3].includes(row.rank) ? 'bg-primary/5' : ''}`}
                >
                  <td className="px-4 lg:px-5 py-3">
                    {row.rank ? (
                      <Trophy size={18} className={row.rank === 1 ? 'text-yellow-500' : row.rank === 2 ? 'text-gray-400' : row.rank === 3 ? 'text-amber-700' : 'text-[#94A3B8]'} />
                    ) : (
                      <span className="text-xs text-[#64748B]">-</span>
                    )}
                  </td>
                  <td className="px-4 lg:px-5 py-3 text-sm font-semibold text-[#0F172A] whitespace-nowrap">{row.name}</td>
                  <td className="px-4 lg:px-5 py-3 text-center"><MedalCell type="Gold" value={row.gold} /></td>
                  <td className="px-4 lg:px-5 py-3 text-center"><MedalCell type="Silver" value={row.silver} /></td>
                  <td className="px-4 lg:px-5 py-3 text-center"><MedalCell type="Bronze" value={row.bronze} /></td>
                  <td className="px-4 lg:px-5 py-3 text-center">
                    <span className="text-sm font-extrabold text-[#0F172A]">{row.total ?? row.gold + row.silver + row.bronze}</span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
            {filteredRows.length > 0 && (
              <tfoot>
                <tr className="bg-gray-50/80 border-t border-gray-100">
                  <td className="px-4 lg:px-5 py-3" />
                  <td className="px-4 lg:px-5 py-3 text-xs font-bold text-[#64748B] uppercase tracking-wider">Total</td>
                  <td className="px-4 lg:px-5 py-3 text-center"><span className="text-sm font-bold text-yellow-500">{totals.gold}</span></td>
                  <td className="px-4 lg:px-5 py-3 text-center"><span className="text-sm font-bold text-gray-400">{totals.silver}</span></td>
                  <td className="px-4 lg:px-5 py-3 text-center"><span className="text-sm font-bold text-amber-700">{totals.bronze}</span></td>
                  <td className="px-4 lg:px-5 py-3 text-center"><span className="text-sm font-extrabold text-[#0F172A]">{totals.total}</span></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  )
}
