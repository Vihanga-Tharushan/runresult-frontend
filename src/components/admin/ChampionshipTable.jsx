import { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, Pencil, Trash2, Search, Plus, X } from 'lucide-react'
import StatusBadge from './StatusBadge'
import EmptyState from './EmptyState'
import { TableSkeleton } from './LoadingSkeleton'
import ConfirmDialog from './ConfirmDialog'

export default function ChampionshipTable({ championships, loading, onView, onEdit, onDelete, onCreate }) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [deleteTarget, setDeleteTarget] = useState(null)

  const filtered = championships.filter(c => {
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.venue.toLowerCase().includes(search.toLowerCase()) || c.organizer.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || c.registrationStatus === statusFilter
    return matchSearch && matchStatus
  })

  if (loading) return <TableSkeleton rows={5} cols={6} />

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B] pointer-events-none" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search championships..."
            className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-[#0F172A] placeholder:text-[#64748B] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all" />
          {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#0F172A]"><X size={15} /></button>}
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-[#0F172A] focus:outline-none focus:border-primary transition-colors">
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="closing-soon">Closing Soon</option>
            <option value="closed">Closed</option>
            <option value="draft">Draft</option>
          </select>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-all shadow-sm whitespace-nowrap">
            <Plus size={16} />
            <span className="hidden sm:inline">New Championship</span>
          </motion.button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon="trophy" title="No championships found"
          description={search ? 'Try adjusting your search or filters.' : 'Get started by creating your first championship.'}
          action={!search && <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-all"><Plus size={16} /> Create Championship</motion.button>} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
          {filtered.map((champ, index) => (
            <motion.div
              key={champ.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 group"
            >
              <div className="relative h-40 lg:h-44 overflow-hidden bg-gray-100">
                {champ.banner ? (
                  <img src={champ.banner} alt={champ.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10">
                    <TrophyIcon />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <div className="absolute top-3 right-3 flex gap-2">
                  <StatusBadge status={champ.registrationStatus} size="sm" />
                </div>
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="text-sm font-bold text-white drop-shadow-sm truncate">{champ.name}</h3>
                </div>
              </div>
              <div className="p-4 lg:p-5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-[#64748B]">
                    <StatusBadge status={champ.publishStatus === 'published' ? 'published' : 'unpublished'} size="sm" />
                    <span>{champ.eventCount} events</span>
                  </div>
                </div>
                <div className="space-y-1 text-xs text-[#64748B]">
                  <p className="truncate">📍 {champ.venue}</p>
                  <p>🏛 {champ.organizer}</p>
                  <p>📅 {new Date(champ.startDate).toLocaleDateString()} - {new Date(champ.endDate).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-2 pt-2 border-t border-gray-50">
                  <button onClick={() => onView(champ)} className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-[#64748B] hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all"><Eye size={14} /> View</button>
                  <button onClick={() => onEdit(champ)} className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-[#64748B] hover:text-amber-600 hover:border-amber-200 hover:bg-amber-50 transition-all"><Pencil size={14} /> Edit</button>
                  <button onClick={() => setDeleteTarget(champ)} className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-[#64748B] hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-all"><Trash2 size={14} /> Delete</button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => { onDelete(deleteTarget.id); setDeleteTarget(null) }}
        title="Delete Championship"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  )
}

function TrophyIcon() {
  return (
    <svg className="w-12 h-12 text-primary/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0016.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.023 6.023 0 01-2.77.896m0 0a6.023 6.023 0 01-2.77-.896" />
    </svg>
  )
}
