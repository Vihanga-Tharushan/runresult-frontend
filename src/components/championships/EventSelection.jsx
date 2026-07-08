import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, AlertTriangle, Layers } from 'lucide-react'

const categories = ['Track', 'Field']

export default function EventSelection({ events, maxEvents, selectedEvents, onToggle, feePerEvent, baseFee, maxFee }) {
  const [activeCategory, setActiveCategory] = useState('Track')

  const trackEvents = events.filter((e) => e.category === 'Track')
  const fieldEvents = events.filter((e) => e.category === 'Field')

  const visibleEvents = activeCategory === 'Track' ? trackEvents : fieldEvents

  const fee = selectedEvents.length * feePerEvent
  const total = baseFee + fee
  const cappedTotal = maxFee ? Math.min(total, maxFee) : total

  const isAtLimit = selectedEvents.length >= maxEvents

  const handleToggle = (eventId) => {
    if (selectedEvents.includes(eventId)) {
      onToggle(selectedEvents.filter((id) => id !== eventId))
    } else if (!isAtLimit) {
      onToggle([...selectedEvents, eventId])
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="lg:grid lg:grid-cols-3 lg:gap-8"
    >
      <div className="lg:col-span-2">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 lg:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center">
              <Layers size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#0F172A]">Select Events</h3>
              <p className="text-sm text-[#64748B]">
                Choose up to {maxEvents} events
                {isAtLimit && selectedEvents.length >= maxEvents && (
                  <span className="text-amber-500"> — maximum reached</span>
                )}
              </p>
            </div>
          </div>

          <div className="flex gap-2 mb-6">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  activeCategory === cat
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-gray-100 text-[#64748B] hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <motion.div layout className="grid sm:grid-cols-2 gap-3">
            <AnimatePresence mode="popLayout">
              {visibleEvents.map((event) => {
                const isSelected = selectedEvents.includes(event.id)
                const isDisabled = !isSelected && isAtLimit

                return (
                  <motion.button
                    layout
                    key={event.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    onClick={() => handleToggle(event.id)}
                    disabled={isDisabled && !isSelected}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all duration-200 ${
                      isSelected
                        ? 'border-primary bg-primary/5 shadow-sm'
                        : isDisabled
                        ? 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
                        : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-200 ${
                      isSelected ? 'bg-primary shadow-sm' : 'border-2 border-gray-300'
                    }`}>
                      {isSelected && <Check size={14} className="text-white" />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#0F172A]">{event.name}</p>
                      <p className="text-xs text-[#64748B]">{event.type}</p>
                    </div>
                  </motion.button>
                )
              })}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      <div className="mt-5 lg:mt-0">
        <div className="lg:sticky lg:top-28">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 lg:p-8 shadow-sm">
            <h4 className="text-sm font-bold text-[#0F172A] mb-4">Payment Summary</h4>

            <div className="space-y-3 mb-4">
              <SummaryRow label="Base Fee" value={`Rs. ${baseFee.toLocaleString()}`} />
              <SummaryRow
                label={`Events (${selectedEvents.length})`}
                value={`Rs. ${fee.toLocaleString()}`}
              />
              <div className="border-t border-gray-100 pt-3">
                <SummaryRow
                  label="Total"
                  value={`Rs. ${total.toLocaleString()}`}
                  bold
                />
              </div>
              {maxFee && total > maxFee && (
                <div className="bg-emerald-50 rounded-xl px-4 py-2.5">
                  <p className="text-xs text-emerald-600 font-medium">
                    Fee capped at Rs. {maxFee.toLocaleString()}
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <span className="text-xs font-medium text-[#64748B]">Selected Events</span>
              <span className="text-lg font-extrabold text-primary">{selectedEvents.length} / {maxEvents}</span>
            </div>

            {isAtLimit && selectedEvents.length >= maxEvents && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2 mt-3 p-3 bg-amber-50 rounded-xl border border-amber-100"
              >
                <AlertTriangle size={14} className="text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700">
                  You can register for a maximum of {maxEvents} events in this championship.
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function SummaryRow({ label, value, bold }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-[#64748B]">{label}</span>
      <span className={`text-sm ${bold ? 'font-bold text-[#0F172A]' : 'font-medium text-[#0F172A]'}`}>{value}</span>
    </div>
  )
}
