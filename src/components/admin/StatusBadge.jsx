import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Clock, AlertTriangle, Eye, EyeOff } from 'lucide-react'

const variants = {
  open: { bg: 'bg-emerald-50 text-emerald-600 border-emerald-200', icon: CheckCircle },
  'closing-soon': { bg: 'bg-amber-50 text-amber-600 border-amber-200', icon: AlertTriangle },
  closed: { bg: 'bg-red-50 text-red-500 border-red-200', icon: XCircle },
  draft: { bg: 'bg-gray-100 text-gray-500 border-gray-200', icon: Clock },
  published: { bg: 'bg-emerald-50 text-emerald-600 border-emerald-200', icon: Eye },
  unpublished: { bg: 'bg-gray-100 text-gray-500 border-gray-200', icon: EyeOff },
  active: { bg: 'bg-emerald-50 text-emerald-600 border-emerald-200', icon: CheckCircle },
  inactive: { bg: 'bg-gray-100 text-gray-500 border-gray-200', icon: XCircle },
  connected: { bg: 'bg-emerald-50 text-emerald-600 border-emerald-200', icon: CheckCircle },
  disconnected: { bg: 'bg-red-50 text-red-500 border-red-200', icon: XCircle },
}

const labels = {
  open: 'Open',
  'closing-soon': 'Closing Soon',
  closed: 'Closed',
  draft: 'Draft',
  published: 'Published',
  unpublished: 'Unpublished',
  active: 'Active',
  inactive: 'Inactive',
  connected: 'Connected',
  disconnected: 'Not Connected',
}

export default function StatusBadge({ status, size = 'sm' }) {
  const variant = variants[status] || variants.draft
  const Icon = variant.icon
  const label = labels[status] || status
  const padding = size === 'sm' ? 'px-2.5 py-1' : 'px-3 py-1.5'
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm'
  const iconSize = size === 'sm' ? 11 : 14

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center gap-1 ${padding} rounded-full ${textSize} font-semibold border ${variant.bg} capitalize`}
    >
      <Icon size={iconSize} />
      {label}
    </motion.span>
  )
}
