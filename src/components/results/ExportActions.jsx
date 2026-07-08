import { motion } from 'framer-motion'
import { Printer, Download } from 'lucide-react'

export default function ExportActions() {
  return (
    <div className="flex items-center gap-2">
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => window.print()}
        className="inline-flex items-center gap-2 px-4 py-2 bg-white text-[#64748B] font-medium text-sm rounded-xl border border-gray-200 hover:border-gray-300 hover:text-[#0F172A] hover:shadow-sm transition-all duration-200"
      >
        <Printer size={15} />
        <span className="hidden sm:inline">Print</span>
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="inline-flex items-center gap-2 px-4 py-2 bg-white text-[#64748B] font-medium text-sm rounded-xl border border-gray-200 hover:border-gray-300 hover:text-[#0F172A] hover:shadow-sm transition-all duration-200"
      >
        <Download size={15} />
        <span className="hidden sm:inline">Export PDF</span>
      </motion.button>
    </div>
  )
}
