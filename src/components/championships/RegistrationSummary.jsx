import { motion } from 'framer-motion'
import { CheckCircle, CreditCard, Upload, User, Layers, DollarSign, MapPin, Calendar, Building2, FileText } from 'lucide-react'
import StatusBadge from './StatusBadge'

export default function RegistrationSummary({ championship, formData, selectedEvents, paymentMethod, total, bankSlip }) {
  const fee = selectedEvents.length * championship.feePerEvent
  const rawTotal = championship.baseFee + fee
  const cappedTotal = championship.maxFee ? Math.min(rawTotal, championship.maxFee) : rawTotal

  const getEventName = (id) => {
    const event = championship.events.find((e) => e.id === id)
    return event ? event.name : id
  }

  const isFormComplete = formData.fullName && formData.gender && formData.dateOfBirth && formData.email && formData.mobile
  const isEventsSelected = selectedEvents.length > 0
  const isPaymentSelected = paymentMethod === 'online' || (paymentMethod === 'bank-slip' && bankSlip)

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="lg:grid lg:grid-cols-3 lg:gap-8"
    >
      <div className="lg:col-span-2 space-y-5">
        <SummarySection
          icon={User}
          title="Personal Information"
          status={isFormComplete ? 'complete' : 'incomplete'}
        >
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-2 text-sm">
            <SummaryItem label="Full Name" value={formData.fullName} />
            <SummaryItem label="Gender" value={formData.gender} />
            <SummaryItem label="Date of Birth" value={formData.dateOfBirth} />
            <SummaryItem label="Age Category" value={formData.ageCategory} />
            <SummaryItem label="Email" value={formData.email} />
            <SummaryItem label="Mobile" value={formData.mobile} />
            <SummaryItem label="Institution" value={formData.institution} />
            <SummaryItem label="Coach" value={formData.coachName || '—'} />
          </div>
        </SummarySection>

        <SummarySection
          icon={Layers}
          title="Selected Events"
          status={isEventsSelected ? 'complete' : 'incomplete'}
        >
          <div className="flex flex-wrap gap-2">
            {selectedEvents.map((id) => (
              <span key={id} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/5 rounded-xl text-sm font-medium text-primary border border-primary/10">
                <CheckCircle size={13} />
                {getEventName(id)}
              </span>
            ))}
          </div>
        </SummarySection>

        <SummarySection
          icon={paymentMethod === 'online' ? CreditCard : Upload}
          title={paymentMethod === 'online' ? 'Online Payment' : 'Bank Deposit Slip'}
          status={isPaymentSelected ? 'complete' : 'incomplete'}
        >
          {paymentMethod === 'online' ? (
            <div className="flex items-center gap-2 text-sm text-emerald-600">
              <CheckCircle size={16} />
              Online payment ready
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-[#0F172A]">
              <FileText size={16} className="text-primary" />
              {bankSlip?.name || 'Bank slip ready'}
            </div>
          )}
        </SummarySection>

        <SummarySection
          icon={DollarSign}
          title="Payment Summary"
          status="complete"
        >
          <div className="space-y-2 text-sm">
            <SummaryItem label="Base Fee" value={`Rs. ${championship.baseFee.toLocaleString()}`} />
            <SummaryItem label={`Events (${selectedEvents.length} × Rs. ${championship.feePerEvent.toLocaleString()})`} value={`Rs. ${fee.toLocaleString()}`} />
            <div className="border-t border-gray-100 pt-2 mt-2">
              <SummaryItem label="Total" value={`Rs. ${cappedTotal.toLocaleString()}`} bold />
            </div>
            {championship.maxFee && rawTotal > championship.maxFee && (
              <p className="text-xs text-emerald-600">Fee capped at Rs. {championship.maxFee.toLocaleString()}</p>
            )}
          </div>
        </SummarySection>
      </div>

      <div className="mt-5 lg:mt-0">
        <div className="lg:sticky lg:top-28">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 lg:p-8 shadow-sm">
            <h4 className="text-sm font-bold text-[#0F172A] mb-4">Championship Info</h4>
            <div className="space-y-3 text-sm">
              <SummaryItem label="Championship" value={championship.name} />
              <SummaryItem label="Organizer" value={championship.organizer} />
              <SummaryItem label="Venue" value={championship.venue} />
              <SummaryItem label="Dates" value={`${championship.startDate} — ${championship.endDate}`} />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function SummarySection({ icon: Icon, title, status, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 lg:p-8 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center">
            <Icon size={20} className="text-primary" />
          </div>
          <h3 className="text-base font-bold text-[#0F172A]">{title}</h3>
        </div>
        {status === 'complete' && <CheckCircle size={18} className="text-emerald-500" />}
      </div>
      {children}
    </div>
  )
}

function SummaryItem({ label, value, bold }) {
  return (
    <div className="flex justify-between items-baseline gap-4">
      <span className="text-[#64748B] shrink-0">{label}</span>
      <span className={`text-right ${bold ? 'font-bold text-[#0F172A]' : 'font-medium text-[#0F172A]'}`}>{value}</span>
    </div>
  )
}
