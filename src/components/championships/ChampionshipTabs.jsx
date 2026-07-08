import { motion } from 'framer-motion'

const tabs = [

  { id: 'registration', label: 'Registration' },
  { id: 'overview', label: 'Overview' },
  { id: 'schedule', label: 'Schedule' },
  { id: 'rules', label: 'Rules & Regulations' }
  
]

export default function ChampionshipTabs({ activeTab, onTabChange }) {
  return (
    <div className="border-b border-gray-100">
      <div className="flex overflow-x-auto gap-1 -mb-px scrollbar-none">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative px-5 py-3.5 lg:px-6 lg:py-4 text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
                isActive
                  ? 'text-primary'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              {tab.label}
              {isActive && (
                <motion.div
                  layoutId="champ-detail-tab"
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
