import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Search, X, Check } from 'lucide-react'

export default function ChampionshipSelector({ championships, selectedId, onSelect }) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const ref = useRef(null)

  useEffect(() => {
    const onKeyDown = (e) => { if (e.key === 'Escape') setIsOpen(false) }
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setIsOpen(false) }
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('mousedown', onClick)
    return () => { document.removeEventListener('keydown', onKeyDown); document.removeEventListener('mousedown', onClick) }
  }, [])

  const selected = championships.find(c => c.id === selectedId)
  const filtered = championships.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.organizer?.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div ref={ref} className="relative">
      <label className="block text-sm font-semibold text-[#0F172A] mb-1.5">Select Championship</label>
      <button
        onClick={() => { setIsOpen(!isOpen); setQuery('') }}
        className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 bg-white border rounded-xl text-sm text-left transition-all duration-200 ${
          isOpen ? 'border-primary ring-2 ring-primary/10' : 'border-gray-200 hover:border-gray-300'
        }`}
      >
        <span className={selected ? 'text-[#0F172A] font-medium' : 'text-[#64748B]'}>
          {selected ? selected.name : 'Choose a championship...'}
        </span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={16} className="text-[#64748B]" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-xl border border-gray-200 shadow-lg z-50 overflow-hidden"
          >
            <div className="relative border-b border-gray-100">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search championships..."
                className="w-full pl-10 pr-8 py-2.5 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none"
                autoFocus
              />
              {query && (
                <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#0F172A]">
                  <X size={14} />
                </button>
              )}
            </div>
            <div className="max-h-56 overflow-y-auto py-1">
              {filtered.length === 0 ? (
                <div className="px-4 py-6 text-center text-sm text-[#64748B]">No championships found</div>
              ) : (
                filtered.map(champ => (
                  <button
                    key={champ.id}
                    onClick={() => { onSelect(champ.id); setIsOpen(false) }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors hover:bg-gray-50 ${
                      champ.id === selectedId ? 'text-primary bg-primary/5 font-medium' : 'text-[#0F172A]'
                    }`}
                  >
                    <span className="flex-1 truncate">{champ.name}</span>
                    {champ.id === selectedId && <Check size={14} className="text-primary shrink-0" />}
                    <span className="text-xs text-[#64748B] shrink-0">{champ.organizer}</span>
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
