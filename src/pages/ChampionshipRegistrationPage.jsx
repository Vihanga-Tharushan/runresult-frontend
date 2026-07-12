import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, FileText, CheckCircle } from 'lucide-react'
import axios from 'axios'
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

const API = import.meta.env.VITE_API_URL

export default function ChampionshipRegistrationPage() {
  const { championshipId } = useParams()
  const [championship, setChampionship] = useState(null)
  const [loading, setLoading] = useState(true)

  const [activeTab, setActiveTab] = useState('registration')
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    fullName: '', nameWithInitials: '', gender: '', dateOfBirth: '',
    ageCategory: '', email: '', mobile: '', nic: '', institution: '',
    address: { district: '', addressLine1: '', addressLine2: '' },
  })
  const [selectedEvents, setSelectedEvents] = useState([])
  const [paymentMethod, setPaymentMethod] = useState('')
  const [bankSlip, setBankSlip] = useState(null)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [registrationResult, setRegistrationResult] = useState(null)

  useEffect(() => {
    setLoading(true)
    axios.get(API + `/api/championships/${championshipId}`)
      .then((res) => setChampionship(res.data.championship))
      .catch(() => setChampionship(null))
      .finally(() => setLoading(false))
  }, [championshipId])

  if (loading) {
    return (
      <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
        <AthleteNavbar />
        <div className="pt-24 lg:pt-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-4">
            <div className="h-64 bg-gray-200 rounded-2xl" />
            <div className="h-8 bg-gray-200 rounded w-1/3" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
        <Footer />
      </motion.main>
    )
  }

  if (!championship) {
    return (
      <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
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

  const isRegistrationOpen = championship.registrationStatus === 'open' || championship.registrationStatus === 'closing-soon'

  const baseFee = championship.pricing?.[0]?.fee || 0
  const feePerEvent = championship.pricing?.[1]?.fee || 0
  const maxFee = championship.maxEventsPerAthlete ? baseFee + (championship.maxEventsPerAthlete * feePerEvent) : null

  const mappedEvents = (championship.selectedEvents || []).map((name, i) => ({
    id: i,
    name,
    category: name.toLowerCase().includes('shot') || name.toLowerCase().includes('discus') || name.toLowerCase().includes('javelin') || name.toLowerCase().includes('long') || name.toLowerCase().includes('high') || name.toLowerCase().includes('triple') || name.toLowerCase().includes('pole') ? 'Field' : 'Track',
    type: 'Individual',
  }))

  const mappedChampionship = {
    ...championship,
    id: championship.championship_id,
    status: championship.registrationStatus,
    deadline: championship.regCloseDate || 'TBD',
    baseFee,
    feePerEvent,
    maxEvents: championship.maxEventsPerAthlete || 3,
    maxFee,
    events: mappedEvents,
    rules: '',
  }

  const fee = selectedEvents.length * feePerEvent
  const rawTotal = baseFee + fee
  const total = maxFee ? Math.min(rawTotal, maxFee) : rawTotal

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

  const handleComplete = async () => {
    setSubmitting(true)
    setSubmitError('')
    try {
      const res = await axios.post(API + '/api/registrations', {
        championshipId: championship.championship_id,
        fullName: formData.fullName,
        nameWithInitials: formData.nameWithInitials,
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth,
        ageCategory: formData.ageCategory,
        email: formData.email,
        mobile: formData.mobile,
        nic: formData.nic || '',
        institution: formData.institution,
        address: formData.address,
        selectedEvents,
        paymentMethod,
        totalFee: total,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      setRegistrationResult(res.data.registration)
      setSubmitted(true)
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleTabClick = (tabId) => {
    if (tabId === 'registration') {
      setActiveTab('registration')
    } else {
      setActiveTab(tabId)
    }
  }

  const scheduleContent = mappedEvents.length > 0 ? (
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
            {mappedEvents.map((event) => (
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
            <ChampionshipHero championship={mappedChampionship} />
            <div className="max-w-4xl mx-auto py-8">
              <RegistrationSuccess
                championship={mappedChampionship}
                formData={formData}
                selectedEvents={selectedEvents}
                total={total}
                paymentMethod={paymentMethod}
                registrationNumber={registrationResult?.registrationNumber}
                bibNumber={registrationResult?.bibNumber}
                paymentStatus={registrationResult?.paymentStatus}
              />
            </div>
          </div>
        </section>
      ) : (
        <>
          <ChampionshipHero championship={mappedChampionship} />

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
                      <OverviewContent championship={mappedChampionship} />
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
                      <RulesContent championship={mappedChampionship} />
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
                      {!isRegistrationOpen ? (
                        <RegistrationClosedContent />
                      ) : (
                        <RegistrationWizard
                          step={step}
                          formData={formData}
                          handleFormChange={handleFormChange}
                          errors={errors}
                          championship={mappedChampionship}
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
                          submitting={submitting}
                          submitError={submitError}
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

function OverviewContent({ championship }) {
  return (
    <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 lg:p-8 shadow-sm">
          <h3 className="text-lg font-bold text-[#0F172A] mb-3">About the Championship</h3>
          <p className="text-sm text-[#64748B] leading-relaxed">{championship.description || 'No description available.'}</p>
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
            {championship.maxFee && (
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-xs text-[#64748B] mb-1">Max Fee</p>
                <p className="text-lg font-extrabold text-[#0F172A]">Rs. {championship.maxFee.toLocaleString()}</p>
              </div>
            )}
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
      </div>
    </div>
  )
}

function RulesContent({ championship }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 lg:p-8 shadow-sm">
      <h3 className="text-lg font-bold text-[#0F172A] mb-6">Rules & Regulations</h3>
      <p className="text-sm text-[#64748B]">Rules are not yet available for this championship.</p>
    </div>
  )
}

function RegistrationClosedContent() {
  return (
    <div className="text-center py-16">
      <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-6">
        <FileText size={44} className="text-gray-400" />
      </div>
      <h2 className="text-2xl font-extrabold text-[#0F172A] mb-2">Registration Closed</h2>
      <p className="text-sm text-[#64748B] mb-8 max-w-sm mx-auto">
        Registration for this championship is currently not open. Please check back later.
      </p>
      <Link
        to="/championships"
        className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all duration-200"
      >
        <ArrowLeft size={16} />
        Back to Championships
      </Link>
    </div>
  )
}

function RegistrationWizard({
  step, formData, handleFormChange, errors,
  championship, selectedEvents, setSelectedEvents,
  paymentMethod, setPaymentMethod, bankSlip, setBankSlip,
  total, handleNext, handleBack, handleComplete, setErrors,
  submitting, submitError,
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

      {submitError && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          {submitError}
        </div>
      )}

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
            disabled={submitting}
            className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all duration-200 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Submitting...
              </>
            ) : (
              <>
                <CheckCircle size={18} />
                Complete Registration
              </>
            )}
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
            disabled={submitting}
            className="w-full inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all duration-200 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Submitting...
              </>
            ) : (
              <>
                <CheckCircle size={18} />
                Complete Registration
              </>
            )}
          </button>
        )}
      </div>

      <div className="h-20 lg:hidden" />
    </div>
  )
}
