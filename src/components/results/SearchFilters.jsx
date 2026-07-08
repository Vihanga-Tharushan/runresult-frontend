import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, SlidersHorizontal, X } from 'lucide-react'

export default function SearchFilters({ onSearch, onFilterChange, placeholder = 'Search athletes, events...' }) {
  const [query, setQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const handleSearch = (value) => {
    setQuery(value)
    if (onSearch) onSearch(value)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B] pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-[#0F172A] placeholder:text-[#64748B] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-200"
          />
          {query && (
            <button
              onClick={() => handleSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#0F172A] transition-colors"
            >
              <X size={15} />
            </button>
          )}
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowFilters(!showFilters)}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200 ${
            showFilters
              ? 'bg-primary text-white border-primary'
              : 'bg-white text-[#64748B] border-gray-200 hover:border-gray-300 hover:text-[#0F172A]'
          }`}
        >
          <SlidersHorizontal size={15} />
          <span className="hidden sm:inline">Filters</span>
        </motion.button>
      </div>

      <motion.div
        initial={false}
        animate={{
          height: showFilters ? 'auto' : 0,
          opacity: showFilters ? 1 : 0,
        }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden"
      >
        <div className="flex flex-wrap gap-3 p-4 bg-white rounded-2xl border border-gray-100">
          <select className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm text-[#0F172A] focus:outline-none focus:border-primary transition-colors">
            <option value="">All Events</option>
            <option value="100m">100m</option>
            <option value="200m">200m</option>
            <option value="400m">400m</option>
            <option value="800m">800m</option>
            <option value="1500m">1500m</option>
          </select>
          <select className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm text-[#0F172A] focus:outline-none focus:border-primary transition-colors">
            <option value="">All Genders</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="mixed">Mixed</option>
          </select>
          <select className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm text-[#0F172A] focus:outline-none focus:border-primary transition-colors">
            <option value="">All Categories</option>
            <option value="senior">Senior</option>
            <option value="junior">Junior</option>
            <option value="u20">U20</option>
            <option value="u18">U18</option>
          </select>
          <select className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm text-[#0F172A] focus:outline-none focus:border-primary transition-colors">
            <option value="">All Rounds</option>
            <option value="heats">Heats</option>
            <option value="semifinals">Semi-Finals</option>
            <option value="final">Final</option>
          </select>
        </div>
      </motion.div>
    </div>
  )
}
