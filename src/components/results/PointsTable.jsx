import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, Trophy, Medal } from 'lucide-react'
import EmptyState from './EmptyState'

function RankBadge({ place }) {
  if (!place) return <span className="text-xs text-[#64748B]">-</span>
  if (place === 1) return <Trophy size={18} className="text-yellow-500" />
  if (place === 2) return <Trophy size={18} className="text-gray-400" />
  if (place === 3) return <Trophy size={18} className="text-amber-700" />
  return <span className="text-sm font-bold text-[#0F172A]">{place}</span>
}

function PointsCard({ title, subtitle, rows, columns, highlight }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4 lg:px-6 border-b border-gray-100">
        <div className="w-9 h-9 rounded-lg bg-primary/5 flex items-center justify-center shrink-0">
          <Medal size={16} className="text-primary" />
        </div>
        <div>
          <h3 className="text-sm lg:text-base font-bold text-[#0F172A]">{title}</h3>
          {subtitle && <p className="text-xs text-[#64748B]">{subtitle}</p>}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50/80">
              {columns.map((col, i) => (
                <th key={i} className={`text-left px-4 lg:px-5 py-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider ${col.hidden || ''}`}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10 text-center text-sm text-[#64748B]">
                  No data available yet.
                </td>
              </tr>
            ) : rows.map((row, ri) => (
              <motion.tr
                key={row.key || ri}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.2, delay: ri * 0.03 }}
                className={`border-t border-gray-100 hover:bg-gray-50/50 transition-colors ${highlight && highlight(row) ? 'bg-primary/5' : ''}`}
              >
                {columns.map((col, ci) => (
                  <td key={ci} className={`px-4 lg:px-5 py-3 ${col.cellClass || ''} ${col.hidden || ''}`}>
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function PointsTable({ pointsData, loading }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [view, setView] = useState('zones')

  const zones = useMemo(() => pointsData?.zones || [], [pointsData])
  const schools = useMemo(() => pointsData?.schools || [], [pointsData])

  const filteredSchools = useMemo(() => {
    if (!searchQuery.trim()) return schools
    const q = searchQuery.toLowerCase()
    return schools.filter(
      (s) =>
        s.school?.toLowerCase().includes(q) ||
        s.zone?.toLowerCase().includes(q)
    )
  }, [schools, searchQuery])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-primary rounded-full animate-spin" />
        <span className="text-sm font-medium text-[#64748B]">Loading points...</span>
      </div>
    )
  }

  if ((!pointsData || (zones.length === 0 && schools.length === 0))) {
    return (
      <EmptyState
        icon="file"
        title="No Points Available"
        description="Points tables have not been published yet for this championship."
      />
    )
  }

  const zoneColumns = [
    { label: 'Place', key: 'place', render: (r) => <RankBadge place={r.place} /> },
    { label: 'Zone/Company', key: 'zone', cellClass: 'text-sm font-semibold text-[#0F172A] whitespace-nowrap' },
    { label: 'Points', key: 'points', cellClass: 'text-sm font-bold text-primary text-right', render: (r) => <span className="flex justify-end">{r.points}</span> },
  ]

  const schoolColumns = [
    { label: 'Place', key: 'place', render: (r) => <RankBadge place={r.place} /> },
    { label: 'School', key: 'school', cellClass: 'text-sm font-semibold text-[#0F172A] whitespace-nowrap' },
    { label: 'Zone/Company', key: 'zone', cellClass: 'text-sm text-[#64748B] whitespace-nowrap', hidden: 'hidden md:table-cell' },
    { label: 'Points', key: 'points', cellClass: 'text-sm font-bold text-primary', render: (r) => <span className="flex justify-end">{r.points}</span> },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex rounded-xl border border-gray-200 bg-white p-1 overflow-x-auto">
          <button
            onClick={() => setView('zones')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${view === 'zones' ? 'bg-primary text-white' : 'text-[#64748B] hover:text-[#0F172A]'}`}
          >
            Overall Zonal/company Points
          </button>
          <button
            onClick={() => setView('schools')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${view === 'schools' ? 'bg-primary text-white' : 'text-[#64748B] hover:text-[#0F172A]'}`}
          >
            Overall School Points
          </button>
        </div>
        {view === 'schools' && (
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B] pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search schools or zones..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-[#0F172A] placeholder:text-[#64748B] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-200"
            />
          </div>
        )}
      </div>

      {view === 'zones' ? (
        <PointsCard
          title="Overall Zonal Points"
          subtitle="Championship standings by zone"
          rows={zones}
          columns={zoneColumns}
        />
      ) : (
        <PointsCard
          title="Overall School Points"
          subtitle={`${filteredSchools.length} of ${schools.length} schools`}
          rows={filteredSchools}
          columns={schoolColumns}
          highlight={(r) => [1, 2, 3].includes(r.place)}
        />
      )}
    </div>
  )
}
