import { useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, FileText, CheckCircle } from 'lucide-react'
import AthleteNavbar from '../components/AthleteNavbar'
import Footer from '../components/Footer'
import ChampionshipHero from '../components/championships/ChampionshipHero'
import ChampionshipTabs from '../components/championships/ChampionshipTabs'
import RegistrationStepper from '../components/championships/RegistrationStepper'
import AthleteInfoForm from '../components/championships/AthleteInfoForm'
import EventSelection from '../components/championships/EventSelection'
import PaymentMethods from '../components/championships/PaymentMethods'
import RegistrationSummary from '../components/championships/RegistrationSummary'
import RegistrationSuccess from '../components/championships/RegistrationSuccess'
import { registrationChampionships, userRegistrations, athleteProfile } from '../data/registration'

export default function ChampionshipRegistrationPage() {
  const { championshipId } = useParams()
  const championship = registrationChampionships.find((c) => c.id === championshipId)

  const [activeTab, setActiveTab] = useState('registration')
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({ ...athleteProfile })
  const [selectedEvents, setSelectedEvents] = useState([])
  const [paymentMethod, setPaymentMethod] = useState('')
  const [bankSlip, setBankSlip] = useState(null)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [registrationNumber, setRegistrationNumber] = useState('')

  if (!championship) {
    return (
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <AthleteNavbar />
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center pt-24 lg:pt-28">
          <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-4">
            <FileText size={28} className="text-gray-300" />
          </div>
          <h2 className="text-xl font-bold text-[#0F172A] mb-1">Championship Not Found</h2>
          <p className="text-sm text-[#64748B] mb-6">The championship you are looking for does not exist.</p>
          <Link
            to="/championships"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all duration-200 text-sm"
          >
            <ArrowLeft size={16} />
            Back to Championships
          </Link>
        </div>
        <Footer />
      </motion.main>
    )
  }

  const isRegistered = userRegistrations.some((r) => r.championshipId === championshipId)

  const fee = selectedEvents.length * championship.feePerEvent
  const rawTotal = championship.baseFee + fee
  const total = championship.maxFee ? Math.min(rawTotal, championship.maxFee) : rawTotal

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: '', ['address.' + field]: '' }))
  }

  const validateStep1 = () => {
    const errs = {}
    if (!formData.fullName.trim()) errs.fullName = 'Full name is required'
    if (!formData.nameWithInitials.trim()) errs.nameWithInitials = 'Name with initials is required'
    if (!formData.gender) errs.gender = 'Gender is required'
    if (!formData.dateOfBirth) errs.dateOfBirth = 'Date of birth is required'
    if (!formData.ageCategory) errs.ageCategory = 'Age category is required'
    if (!formData.email.trim()) errs.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = 'Invalid email address'
    if (!formData.mobile.trim()) errs.mobile = 'Mobile number is required'
    if (!formData.address.district) errs['address.district'] = 'District is required'
    if (!formData.institution.trim()) errs.institution = 'Institution is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const validateStep2 = () => {
    if (selectedEvents.length === 0) {
      setErrors({ events: 'Please select at least one event' })
      return false
    }
    return true
  }

  const validateStep3 = () => {
    const errs = {}
    if (!paymentMethod) errs.method = 'Please select a payment method'
    if (paymentMethod === 'bank-slip' && !bankSlip) errs.bankSlip = 'Please upload your bank deposit slip'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2)
    else if (step === 2 && validateStep2()) setStep(3)
    else if (step === 3 && validateStep3()) setStep(4)
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
      setErrors({})
    }
  }

  const generateRegNumber = () => {
    const count = userRegistrations.length + 1
    return `RRN-2026-${String(count).padStart(4, '0')}`
  }

  const handleComplete = () => {
    setRegistrationNumber(generateRegNumber())
    setSubmitted(true)
  }

  const handleTabClick = (tabId) => {
    if (tabId === 'registration') {
      setActiveTab('registration')
    } else {
      setActiveTab(tabId)
    }
  }

  const scheduleContent = championship.events.length > 0 ? (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 lg:p-8 shadow-sm">
      <h3 className="text-lg font-bold text-[#0F172A] mb-6">Event Schedule</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left py-3 px-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider">Event</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider">Category</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider">Type</th>
            </tr>
          </thead>
          <tbody>
            {championship.events.map((event, i) => (
              <tr key={event.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="py-3 px-4 font-medium text-[#0F172A]">{event.name}</td>
                <td className="py-3 px-4 text-[#64748B]">{event.category}</td>
                <td className="py-3 px-4 text-[#64748B]">{event.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ) : (
    <div className="text-center py-12">
      <p className="text-sm text-[#64748B]">Schedule information is not yet available for this championship.</p>
    </div>
  )

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <AthleteNavbar />

      {submitted ? (
        <section className="pt-24 lg:pt-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ChampionshipHero championship={championship} />
            <div className="max-w-4xl mx-auto py-8">
              <RegistrationSuccess
                championship={championship}
                formData={formData}
                selectedEvents={selectedEvents}
                total={total}
                paymentMethod={paymentMethod}
                registrationNumber={registrationNumber}
              />
            </div>
          </div>
        </section>
      ) : (
        <>
          <ChampionshipHero championship={championship} />

          <section className="py-8 lg:py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <ChampionshipTabs activeTab={activeTab} onTabChange={handleTabClick} />

              <div className="mt-8 lg:mt-10">
                <AnimatePresence mode="wait">
                  {activeTab === 'overview' && (
                    <motion.div
                      key="overview"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25 }}
                    >
                      <OverviewContent championship={championship} isRegistered={isRegistered} />
                    </motion.div>
                  )}
                  {activeTab === 'schedule' && (
                    <motion.div
                      key="schedule"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25 }}
                    >
                      {scheduleContent}
                    </motion.div>
                  )}
                  {activeTab === 'rules' && (
                    <motion.div
                      key="rules"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25 }}
                    >
                      <RulesContent championship={championship} />
                    </motion.div>
                  )}
                  {activeTab === 'registration' && (
                    <motion.div
                      key="registration"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25 }}
                    >
                      {isRegistered ? (
                        <AlreadyRegisteredContent championship={championship} />
                      ) : (
                        <RegistrationWizard
                          step={step}
                          formData={formData}
                          handleFormChange={handleFormChange}
                          errors={errors}
                          championship={championship}
                          selectedEvents={selectedEvents}
                          setSelectedEvents={setSelectedEvents}
                          paymentMethod={paymentMethod}
                          setPaymentMethod={setPaymentMethod}
                          bankSlip={bankSlip}
                          setBankSlip={setBankSlip}
                          total={total}
                          fee={fee}
                          rawTotal={rawTotal}
                          handleNext={handleNext}
                          handleBack={handleBack}
                          handleComplete={handleComplete}
                          setErrors={setErrors}
                        />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </section>
        </>
      )}

      <Footer />
    </motion.main>
  )
}

function OverviewContent({ championship, isRegistered }) {
  return (
    <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 lg:p-8 shadow-sm">
          <h3 className="text-lg font-bold text-[#0F172A] mb-3">About the Championship</h3>
          <p className="text-sm text-[#64748B] leading-relaxed">{championship.description}</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 lg:p-8 shadow-sm">
          <h3 className="text-lg font-bold text-[#0F172A] mb-4">Registration Details</h3>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-xs text-[#64748B] mb-1">Base Entry Fee</p>
              <p className="text-lg font-extrabold text-[#0F172A]">Rs. {championship.baseFee.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-xs text-[#64748B] mb-1">Fee Per Event</p>
              <p className="text-lg font-extrabold text-[#0F172A]">Rs. {championship.feePerEvent.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-xs text-[#64748B] mb-1">Max Events</p>
              <p className="text-lg font-extrabold text-[#0F172A]">{championship.maxEvents}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-xs text-[#64748B] mb-1">Max Fee</p>
              <p className="text-lg font-extrabold text-[#0F172A]">Rs. {championship.maxFee.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 lg:p-8 shadow-sm">
          <h3 className="text-lg font-bold text-[#0F172A] mb-4">Event Categories</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <span className="text-sm text-[#64748B]">Track Events</span>
              <span className="text-sm font-bold text-[#0F172A]">{championship.events.filter(e => e.category === 'Track').length}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <span className="text-sm text-[#64748B]">Field Events</span>
              <span className="text-sm font-bold text-[#0F172A]">{championship.events.filter(e => e.category === 'Field').length}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-primary/5 rounded-xl">
              <span className="text-sm font-medium text-primary">Total Events</span>
              <span className="text-sm font-bold text-primary">{championship.events.length}</span>
            </div>
          </div>
        </div>

        
        {isRegistered && (
          <div className="bg-emerald-50 rounded-2xl border border-emerald-200 p-6 text-center">
            <CheckCircle size={32} className="text-emerald-500 mx-auto mb-3" />
            <p className="text-sm font-bold text-emerald-700">You are already registered</p>
            <p className="text-xs text-emerald-600 mt-1">View your registration status in your dashboard.</p>
          </div>
        )}
      </div>
    </div>
  )
}

function RulesContent({ championship }) {
  const rules = championship.rules ? championship.rules.split('\n') : ['Rules are not yet available for this championship.']

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 lg:p-8 shadow-sm">
      <h3 className="text-lg font-bold text-[#0F172A] mb-6">Rules & Regulations</h3>
      <div className="space-y-3">
        {rules.filter(Boolean).map((rule, i) => (
          <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
            <span className="w-6 h-6 rounded-lg bg-primary/5 flex items-center justify-center text-xs font-bold text-primary shrink-0">
              {i + 1}
            </span>
            <p className="text-sm text-[#64748B] leading-relaxed">{rule.replace(/^\d+\.\s*/, '')}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function AlreadyRegisteredContent({ championship }) {
  const reg = userRegistrations.find((r) => r.championshipId === championship.id)

  return (
    <div className="text-center py-12">
      <div className="w-20 h-20 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-100">
        <CheckCircle size={44} className="text-emerald-500" />
      </div>
      <h2 className="text-2xl font-extrabold text-[#0F172A] mb-2">Already Registered</h2>
      <p className="text-sm text-[#64748B] mb-8 max-w-sm mx-auto">
        You have already registered for this championship. You cannot register again.
      </p>
      {reg && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm max-w-sm mx-auto text-left">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[#64748B]">Registration No.</span>
              <span className="font-semibold text-[#0F172A]">{reg.registrationNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748B]">Status</span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold text-emerald-600 bg-emerald-50">
                <CheckCircle size={11} />
                {reg.regStatus === 'approved' ? 'Approved' : 'Pending'}
              </span>
            </div>
          </div>
        </div>
      )}
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all duration-200"
      >
        Go to Dashboard
        <ArrowLeft size={16} className="rotate-180" />
      </Link>
    </div>
  )
}

function RegistrationWizard({
  step, formData, handleFormChange, errors,
  championship, selectedEvents, setSelectedEvents,
  paymentMethod, setPaymentMethod, bankSlip, setBankSlip,
  total, handleNext, handleBack, handleComplete, setErrors,
}) {
  return (
    <div className="max-w-4xl mx-auto">
      <RegistrationStepper currentStep={step} />

      <AnimatePresence mode="wait">
        {step === 1 && (
          <AthleteInfoForm
            key="step1"
            data={formData}
            onChange={handleFormChange}
            errors={errors}
          />
        )}
        {step === 2 && (
          <EventSelection
            key="step2"
            events={championship.events}
            maxEvents={championship.maxEvents}
            selectedEvents={selectedEvents}
            onToggle={setSelectedEvents}
            feePerEvent={championship.feePerEvent}
            baseFee={championship.baseFee}
            maxFee={championship.maxFee}
          />
        )}
        {step === 3 && (
          <PaymentMethods
            key="step3"
            method={paymentMethod}
            onMethodChange={(m) => { setPaymentMethod(m); setErrors({}) }}
            bankSlip={bankSlip}
            onBankSlipChange={setBankSlip}
            total={total}
            errors={errors}
          />
        )}
        {step === 4 && (
          <RegistrationSummary
            key="step4"
            championship={championship}
            formData={formData}
            selectedEvents={selectedEvents}
            paymentMethod={paymentMethod}
            total={total}
            bankSlip={bankSlip}
          />
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between mt-8">
        <div>
          {step > 1 && (
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-[#64748B] hover:text-[#0F172A] transition-colors"
            >
              <ArrowLeft size={16} />
              Back
            </button>
          )}
        </div>
        {step < 4 ? (
          <button
            onClick={handleNext}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all duration-200 shadow-sm"
          >
            Continue
            <ArrowLeft size={16} className="rotate-180" />
          </button>
        ) : (
          <button
            onClick={handleComplete}
            className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all duration-200 shadow-lg shadow-primary/20"
          >
            <CheckCircle size={18} />
            Complete Registration
          </button>
        )}
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 z-40">
        {step < 4 ? (
          <button
            onClick={handleNext}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all duration-200 shadow-sm"
          >
            Continue
            <ArrowLeft size={16} className="rotate-180" />
          </button>
        ) : (
          <button
            onClick={handleComplete}
            className="w-full inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all duration-200 shadow-lg shadow-primary/20"
          >
            <CheckCircle size={18} />
            Complete Registration
          </button>
        )}
      </div>

      <div className="h-20 lg:hidden" />
    </div>
  )
}
