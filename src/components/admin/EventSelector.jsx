import { motion } from 'framer-motion'
import { eventCategories } from '../../data/adminData'

export default function EventSelector({ selectedEvents, onChange }) {
  const toggleEvent = (eventId) => {
    const updated = selectedEvents.includes(eventId)
      ? selectedEvents.filter(id => id !== eventId)
      : [...selectedEvents, eventId]
    onChange(updated)
  }

  return (
    <div className="space-y-6">
      {Object.entries(eventCategories).map(([category, groups]) => (
        <div key={category}>
          <h4 className="text-sm font-bold text-[#0F172A] mb-3">{category}</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(groups).map(([groupName, events]) => (
              <div key={groupName} className="bg-gray-50/50 rounded-xl border border-gray-100 p-4">
                <h5 className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-2">{groupName}</h5>
                <div className="space-y-1.5">
                  {events.map((event) => {
                    const eventId = event.toLowerCase().replace(/[\s.'"]/g, '').replace('100mhurdles', '100h').replace('110mhurdles', '110h').replace('400mhurdles', '400h').replace(/4x(\d+)mrelay/, '4x$1').replace('3,000m', '3000').replace('5,000m', '5000').replace('10,000m', '10000').replace('men\'s', '').replace('women\'s', '')
                    const isSelected = selectedEvents.includes(eventId)
                    return (
                      <label
                        key={event}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 ${
                          isSelected
                            ? 'bg-primary/5 text-primary border border-primary/20'
                            : 'text-[#0F172A] hover:bg-white border border-transparent'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleEvent(eventId)}
                          className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/30 accent-primary"
                        />
                        <span className="text-sm font-medium">{event}</span>
                      </label>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      {selectedEvents.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary/5 rounded-xl border border-primary/10 p-4"
        >
          <span className="text-sm font-semibold text-primary">
            {selectedEvents.length} event{selectedEvents.length > 1 ? 's' : ''} selected
          </span>
        </motion.div>
      )}
    </div>
  )
}
