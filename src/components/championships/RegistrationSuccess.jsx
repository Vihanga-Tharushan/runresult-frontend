import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { CheckCircle, ArrowRight, Download, Calendar, MapPin } from 'lucide-react'
import toast from 'react-hot-toast'
import generateReceiptPdf from '../../utils/generateReceiptPdf'

export default function RegistrationSuccess({ championship, formData, selectedEvents, total, receiptNumber, registrationNumber, bibNumber, paymentStatus }) {
  const [downloading, setDownloading] = useState(false)

  const getEventName = (id) => {
    const event = championship.events.find((e) => e.id === id)
    return event ? event.name : id
  }

  const handleDownloadReceipt = () => {
    setDownloading(true)
    try {
      generateReceiptPdf({
        championship,
        formData,
        selectedEvents,
        total,
        receiptNumber,
        registrationNumber,
        bibNumber,
      })
      toast.success('Receipt downloaded successfully')
    } catch (err) {
      console.error('PDF generation failed:', err)
      toast.error('Failed to generate receipt. Please try again.')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12">
      <div className="max-w-lg mx-auto px-4 w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
            className="w-20 h-20 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-100"
          >
            <CheckCircle size={44} className="text-emerald-500" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-2xl lg:text-3xl font-extrabold text-[#0F172A] mb-2">
              Registration Completed Successfully!
            </h2>
            <p className="text-[#64748B] mb-8">
              Thank you for registering. Your participation has been confirmed.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl border border-gray-100 p-6 lg:p-8 shadow-sm text-left mb-8"
          >
            <div className="text-center mb-6 pb-6 border-b border-gray-100">
              <p className="text-xs text-[#64748B] mb-1">Registration Number</p>
              <p className="text-xl font-extrabold text-primary">{registrationNumber}</p>
              {bibNumber && (
                <>
                  <p className="text-xs text-[#64748B] mb-1 mt-3">Bib Number</p>
                  <p className="text-2xl font-extrabold text-[#0F172A]">{bibNumber}</p>
                </>
              )}
            </div>

            <div className="space-y-3">
              <DetailRow icon={Calendar} label="Championship" value={championship.name} />
              <DetailRow icon={MapPin} label="Venue" value={championship.venue} />
              <DetailRow icon={Calendar} label="Dates" value={`${championship.startDate} — ${championship.endDate}`} />

              <div className="pt-3 border-t border-gray-100">
                <p className="text-xs text-[#64748B] mb-2">Selected Events</p>
                <div className="flex flex-wrap gap-2">
                  {selectedEvents.map((id) => (
                    <span key={id} className="inline-flex items-center gap-1 px-3 py-1 bg-primary/5 rounded-lg text-xs font-medium text-primary">
                      {getEventName(id)}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-between pt-3 border-t border-gray-100">
                <span className="text-sm text-[#64748B]">Total Paid</span>
                <span className="text-sm font-bold text-[#0F172A]">Rs. {total.toLocaleString()}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-[#64748B]">Payment Method</span>
                <span className="text-sm font-semibold text-[#0F172A] capitalize">Cash Deposit</span>
              </div>

              {receiptNumber && (
                <div className="flex justify-between">
                  <span className="text-sm text-[#64748B]">Receipt Number</span>
                  <span className="text-sm font-semibold text-[#0F172A]">{receiptNumber}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-sm text-[#64748B]">Payment Status</span>
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  (paymentStatus || 'pending') === 'paid'
                    ? 'text-emerald-600 bg-emerald-50 border border-emerald-200'
                    : 'text-amber-600 bg-amber-50 border border-amber-200'
                }`}>
                  {(paymentStatus || 'pending') === 'paid' ? 'Paid' : 'Pending Verification'}
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <button
              onClick={handleDownloadReceipt}
              disabled={downloading}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {downloading ? (
                <svg className="animate-spin h-[17px] w-[17px]" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <Download size={17} />
              )}
              {downloading ? 'Generating...' : 'Download Receipt'}
            </button>
            <Link
              to="/athlete/championships"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary font-semibold rounded-xl border-2 border-primary/20 hover:bg-primary/5 hover:border-primary/40 transition-all duration-200"
            >
              View My Championships
              <ArrowRight size={17} />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

function DetailRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <Icon size={15} className="text-primary shrink-0 mt-0.5" />
      <div>
        <p className="text-xs text-[#64748B]">{label}</p>
        <p className="text-sm font-semibold text-[#0F172A]">{value}</p>
      </div>
    </div>
  )
}
