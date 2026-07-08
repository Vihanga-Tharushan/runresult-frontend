import { motion } from 'framer-motion'
import { Plus, Trash2 } from 'lucide-react'

export default function PricingTable({ pricing, onChange }) {
  const addRow = () => {
    const nextEvents = pricing.length + 1
    const prevFee = pricing.length > 0 ? pricing[pricing.length - 1].fee + 200 : 500
    onChange([...pricing, { events: nextEvents, fee: prevFee }])
  }

  const removeRow = (index) => {
    if (pricing.length <= 1) return
    const updated = pricing.filter((_, i) => i !== index).map((p, i) => ({ ...p, events: i + 1 }))
    onChange(updated)
  }

  const updateRow = (index, field, value) => {
    const updated = pricing.map((p, i) => i === index ? { ...p, [field]: field === 'fee' ? Number(value) : Number(value) } : p)
    onChange(updated)
  }

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-xl border border-gray-200">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wider">Number of Events</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wider">Fee (Rs.)</th>
              <th className="w-12 px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {pricing.map((row, index) => (
              <tr key={index} className="border-t border-gray-100">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-[#64748B]">{row.events} Event{row.events > 1 ? 's' : ''}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#64748B]">Rs.</span>
                    <input type="number" value={row.fee} onChange={e => updateRow(index, 'fee', e.target.value)}
                      className="w-full pl-10 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-[#0F172A] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all" />
                  </div>
                </td>
                <td className="px-4 py-3">
                  {pricing.length > 1 && (
                    <button type="button" onClick={() => removeRow(index)}
                      className="p-1.5 rounded-lg text-[#64748B] hover:text-red-500 hover:bg-red-50 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <motion.button type="button" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={addRow}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-gray-300 text-sm font-medium text-[#64748B] hover:text-primary hover:border-primary hover:bg-primary/5 transition-all">
        <Plus size={15} /> Add Pricing Tier
      </motion.button>
    </div>
  )
}
