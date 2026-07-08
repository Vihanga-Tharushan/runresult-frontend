import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { LogOut } from 'lucide-react'

export default function UserDropdown({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 top-full mt-2 w-48 bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg shadow-black/10 border border-gray-100 overflow-hidden z-50"
          >
            <div className="p-2">
              <Link
                to="/"
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all duration-200"
              >
                <LogOut size={17} />
                Logout
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
