import { motion } from 'framer-motion'
import { MapPin, Calendar, Plus, Eye } from 'lucide-react'
import EmptyState from './EmptyState'
import { CardSkeleton } from './LoadingSkeleton'

export default function ChampionshipTable({ championships, loading, onCreate, onView }) {
  if (loading) return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
      {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
    </div>
  )

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-all shadow-sm whitespace-nowrap">
          <Plus size={16} />
          <span className="hidden sm:inline">New Championship</span>
        </motion.button>
      </div>

      {championships.length === 0 ? (
        <EmptyState icon="trophy" title="No championships found"
          description="Get started by creating your first championship."
          action={<motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-all"><Plus size={16} /> Create Championship</motion.button>} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
          {championships.map((champ, index) => (
            <motion.div
              key={champ.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              whileHover={{ y: -6 }}
              className="group bg-surface rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
            >
              <div className="relative h-48 overflow-hidden bg-gray-100">
                {champ.banner ? (
                  <img src={champ.banner} alt={champ.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-primary/5 to-primary/10">
                    <TrophyIcon />
                  </div>
                )}
                <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />
              </div>

              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">
                  {champ.name}
                </h3>

                <div className="space-y-1.5 mb-4 text-sm text-gray-500">
                  <p className="flex items-center gap-1.5">
                    <MapPin size={14} className="text-primary shrink-0" />
                    <span className="truncate">{champ.venue}</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-primary shrink-0" />
                    <span>{new Date(champ.startDate).toLocaleDateString()} - {new Date(champ.endDate).toLocaleDateString()}</span>
                  </p>
                </div>

                <button onClick={() => onView?.(champ)}
                  className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-dark transition-all duration-200"
                >
                  <Eye size={14} /> View & Edit
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
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
