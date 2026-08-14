import { useState } from 'react'
import { motion } from 'framer-motion'
import { Receipt, AlertCircle } from 'lucide-react'

export default function PaymentMethods({ receiptNumber, onReceiptNumberChange, total, errors }) {
  const [focused, setFocused] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="lg:grid lg:grid-cols-3 lg:gap-8"
    >
      <div className="lg:col-span-2 space-y-5">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 lg:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center">
              <Receipt size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#0F172A]">Payment</h3>
              <p className="text-sm text-[#64748B]">
                Total payable: <span className="font-semibold text-[#0F172A]">Rs. {total.toLocaleString()}</span>
              </p>
            </div>
          </div>

          <div className="bg-amber-50/50 rounded-xl border border-amber-100/50 p-4 mb-6">
            <div className="flex items-start gap-2">
              <AlertCircle size={15} className="text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700 leading-relaxed">
                Please pay the total fee to the official bank account and enter the unique cash deposit receipt number from your bank slip below.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-[#0F172A] mb-2">
              Cash Deposit Receipt Number <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={receiptNumber}
              onChange={(e) => onReceiptNumberChange(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="e.g. CD-2026-004512"
              className={`w-full px-4 py-3 rounded-xl border text-sm text-[#0F172A] placeholder:text-[#94A3B8] outline-none transition-all ${
                focused ? 'border-primary ring-2 ring-primary/20' : 'border-gray-200'
              } ${errors.receiptNumber ? 'border-red-400' : ''}`}
            />
            <p className="text-xs text-[#64748B] mt-2">
              This receipt number is used to verify your payment. Make sure it matches the number on your cash deposit slip.
            </p>
            {errors.receiptNumber && <p className="text-xs text-red-500 mt-2">{errors.receiptNumber}</p>}
          </div>
        </div>
      </div>

      <div className="mt-5 lg:mt-0">
        <div className="lg:sticky lg:top-28">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 lg:p-8 shadow-sm">
            <h4 className="text-sm font-bold text-[#0F172A] mb-4">Payment Details</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#64748B]">Amount Due</span>
                <span className="font-bold text-[#0F172A]">Rs. {total.toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-100">
              <div className="flex items-start gap-2">
                <AlertCircle size={14} className="text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700">
                  Payment will be verified by the organizers after submission.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
