import { motion } from 'framer-motion'

const badgeConfig = {
  Q: { label: 'Q', color: 'text-emerald-700 bg-emerald-50 border-emerald-200', tooltip: 'Qualified' },
  q: { label: 'q', color: 'text-blue-700 bg-blue-50 border-blue-200', tooltip: 'Fastest Loser' },
  DNS: { label: 'DNS', color: 'text-gray-600 bg-gray-100 border-gray-200', tooltip: 'Did Not Start' },
  DNF: { label: 'DNF', color: 'text-red-700 bg-red-50 border-red-200', tooltip: 'Did Not Finish' },
  DQ: { label: 'DQ', color: 'text-red-700 bg-red-50 border-red-200', tooltip: 'Disqualified' },
  NR: { label: 'NR', color: 'text-purple-700 bg-purple-50 border-purple-200', tooltip: 'National Record' },
  CR: { label: 'CR', color: 'text-amber-700 bg-amber-50 border-amber-200', tooltip: 'Championship Record' },
  PB: { label: 'PB', color: 'text-cyan-700 bg-cyan-50 border-cyan-200', tooltip: 'Personal Best' },
  SB: { label: 'SB', color: 'text-indigo-700 bg-indigo-50 border-indigo-200', tooltip: 'Season Best' },
}

export default function ResultBadge({ type, size = 'sm' }) {
  const config = badgeConfig[type]
  if (!config) return null

  const sizeClass = size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-0.5'

  return (
    <motion.span
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`inline-flex items-center font-bold rounded-full border ${config.color} ${sizeClass} leading-none`}
      title={config.tooltip}
    >
      {config.label}
    </motion.span>
  )
}
