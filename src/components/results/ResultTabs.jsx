import { motion } from 'framer-motion'

const tabs = [
  { id: 'final-results', label: 'Final Results' },
  { id: 'heat-results', label: 'Heat Results' },
  { id: 'start-lists', label: 'Start Lists' },
  { id: 'points', label: 'Points' },
  { id: 'medals', label: 'Medals' },
  { id: 'all-athletes', label: 'Athletes By Event' },
  { id: 'program', label: 'Program' },

  
]

export default function ResultTabs({ activeTab, onTabChange }) {
  return (
    <div className="border-b border-gray-100">
      <div className="flex overflow-x-auto gap-1 -mb-px scrollbar-none">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative px-4 py-3 lg:px-5 lg:py-3.5 text-xs lg:text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
                isActive
                  ? 'text-primary'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              {tab.label}
              {isActive && (
                <motion.div
                  layoutId="result-tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
