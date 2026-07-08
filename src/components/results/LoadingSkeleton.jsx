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

export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
      <div className="px-5 py-4 border-b border-gray-100">
        <div className="h-3 bg-gray-100 rounded w-1/4" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="px-5 py-4 border-b border-gray-50 last:border-0 flex gap-4">
          <div className="h-3 bg-gray-50 rounded w-1/6" />
          <div className="h-3 bg-gray-50 rounded w-1/4" />
          <div className="h-3 bg-gray-50 rounded w-1/6" />
          <div className="h-3 bg-gray-50 rounded w-1/6" />
          <div className="h-3 bg-gray-50 rounded w-1/8" />
        </div>
      ))}
    </div>
  )
}

export function PageSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-64 bg-gray-100 rounded-2xl" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 bg-gray-100 rounded-xl w-28" />
          ))}
        </div>
        <div className="h-64 bg-gray-50 rounded-2xl" />
      </div>
    </div>
  )
}
