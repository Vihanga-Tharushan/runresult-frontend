import { motion } from 'framer-motion'
import { Inbox, SearchX, FileX, Trophy, Users, Table } from 'lucide-react'

const icons = { inbox: Inbox, search: SearchX, file: FileX, trophy: Trophy, users: Users, table: Table }

export default function EmptyState({ icon = 'inbox', title, description, action }) {
  const Icon = icons[icon] || Inbox

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 lg:py-20 text-center"
    >
      <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-4">
        <Icon size={28} className="text-gray-300" />
      </div>
      <h3 className="text-lg font-bold text-[#0F172A] mb-1">{title}</h3>
      <p className="text-sm text-[#64748B] max-w-sm">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </motion.div>
  )
}
