export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 lg:p-6 animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="h-4 bg-gray-100 rounded w-24" />
            <div className="w-10 h-10 bg-gray-100 rounded-xl" />
          </div>
          <div className="h-8 bg-gray-100 rounded w-16 mb-2" />
          <div className="h-3 bg-gray-50 rounded w-20" />
        </div>
      ))}
    </div>
  )
}

export function TableSkeleton({ rows = 5, cols = 5 }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
      <div className="px-5 py-4 border-b border-gray-100 flex gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="h-3 bg-gray-100 rounded w-1/6" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="px-5 py-4 border-b border-gray-50 last:border-0 flex gap-4">
          {Array.from({ length: cols }).map((_, j) => (
            <div key={j} className="h-3 bg-gray-50 rounded w-1/6" />
          ))}
        </div>
      ))}
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
      <div className="h-44 lg:h-48 bg-gray-100" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-gray-100 rounded w-3/4" />
        <div className="h-3 bg-gray-50 rounded w-1/2" />
        <div className="h-3 bg-gray-50 rounded w-2/3" />
        <div className="flex gap-2 pt-2">
          <div className="h-9 bg-gray-100 rounded-xl w-1/2" />
          <div className="h-9 bg-gray-50 rounded-xl w-1/2" />
        </div>
      </div>
    </div>
  )
}

export function ContentSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-64 bg-gray-100 rounded-2xl" />
      <div className="space-y-4">
        <div className="h-4 bg-gray-100 rounded w-1/3" />
        <div className="h-3 bg-gray-50 rounded w-1/2" />
        <div className="h-3 bg-gray-50 rounded w-2/3" />
      </div>
    </div>
  )
}
