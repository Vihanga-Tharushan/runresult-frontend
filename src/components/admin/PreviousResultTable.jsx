import { motion } from 'framer-motion'
import { MapPin, Calendar, Plus, Eye, FileText, Table, Link as LinkIcon } from 'lucide-react'
import EmptyState from './EmptyState'
import { CardSkeleton } from './LoadingSkeleton'

const resultTypeConfig = {
  pdf: { label: 'PDF', color: 'bg-red-50 text-red-600 border-red-100', icon: FileText },
  spreadsheet: { label: 'Spreadsheet', color: 'bg-green-50 text-green-600 border-green-100', icon: Table },
  drive: { label: 'Google Drive', color: 'bg-blue-50 text-blue-600 border-blue-100', icon: LinkIcon },
}

export default function PreviousResultTable({ previousResults, loading, onCreate, onView }) {
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
          <span className="hidden sm:inline">New Previous Result</span>
        </motion.button>
      </div>

      {previousResults.length === 0 ? (
        <EmptyState icon="file" title="No previous results found"
          description="Archive completed championship results by adding your first entry."
          action={<motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-all"><Plus size={16} /> Add Previous Result</motion.button>} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
          {previousResults.map((result, index) => {
            const typeInfo = resultTypeConfig[result.resultType] || resultTypeConfig.pdf
            const TypeIcon = typeInfo.icon
            return (
              <motion.div
                key={result._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                whileHover={{ y: -6 }}
                className="group bg-surface rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
              >
                <div className="relative h-32 overflow-hidden bg-linear-to-br from-primary/5 to-primary/10 flex items-center justify-center">
                  <TypeIcon size={40} className="text-primary/20" />
                  <div className="absolute top-3 right-3">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${typeInfo.color}`}>
                      <TypeIcon size={12} />
                      {typeInfo.label}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">
                    {result.championshipName}
                  </h3>

                  <div className="space-y-1.5 mb-4 text-sm text-gray-500">
                    <p className="flex items-center gap-1.5">
                      <MapPin size={14} className="text-primary shrink-0" />
                      <span className="truncate">{result.venue}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Calendar size={14} className="text-primary shrink-0" />
                      <span>{result.year || '-'}</span>
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-400">
                      Uploaded {new Date(result.createdAt).toLocaleDateString()}
                    </p>
                    <button onClick={() => onView?.(result)}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-dark transition-all duration-200">
                      <Eye size={14} /> View & Edit
                    </button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
