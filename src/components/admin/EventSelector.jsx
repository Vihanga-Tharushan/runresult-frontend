import { motion } from 'framer-motion'
import { flatEvents } from '../../data/adminData'

export default function EventSelector({ selectedEvents, onChange }) {
  const toggleEvent = (eventId) => {
    const updated = selectedEvents.includes(eventId)
      ? selectedEvents.filter(id => id !== eventId)
      : [...selectedEvents, eventId]
    onChange(updated)
  }

  const selectAll = () => {
    const allIds = flatEvents.map(e => e.id)
    const allSelected = allIds.length === selectedEvents.length && allIds.every(id => selectedEvents.includes(id))
    onChange(allSelected ? [] : allIds)
  }

  const grouped = flatEvents.reduce((acc, event) => {
    const key = event.category
    if (!acc[key]) acc[key] = {}
    if (!acc[key][event.group]) acc[key][event.group] = []
    acc[key][event.group].push(event)
    return acc
  }, {})

  const allIds = flatEvents.map(e => e.id)
  const allSelected = allIds.length > 0 && allIds.every(id => selectedEvents.includes(id))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-[#0F172A]">Events</h4>
        <button
          type="button"
          onClick={selectAll}
          className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-primary/30 text-primary hover:bg-primary/5 transition-colors"
        >
          {allSelected ? 'Deselect All' : 'Select All'}
        </button>
      </div>

      {Object.entries(grouped).map(([category, groups]) => (
        <div key={category}>
          <h4 className="text-sm font-bold text-[#0F172A] mb-3">{category}</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(groups).map(([groupName, events]) => (
              <div key={groupName} className="bg-gray-50/50 rounded-xl border border-gray-100 p-4">
                <h5 className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-2">{groupName}</h5>
                <div className="space-y-1.5">
                  {events.map((event) => {
                    const isSelected = selectedEvents.includes(event.id)
                    return (
                      <label
                        key={event.id}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 ${
                          isSelected
                            ? 'bg-primary/5 text-primary border border-primary/20'
                            : 'text-[#0F172A] hover:bg-white border border-transparent'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleEvent(event.id)}
                          className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/30 accent-primary"
                        />
                        <span className="text-sm font-medium">{event.name}</span>
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
