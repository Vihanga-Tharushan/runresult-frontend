import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Eye, EyeOff, Mail, KeyRound, Lock, Trophy, BarChart3, Zap, CheckCircle } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'

export default function ForgetPassword() {
  const navigate = useNavigate()

  const [step, setStep] = useState('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  async function handleSendOTP(e) {
    e.preventDefault()
    if (!email.trim()) {
      setErrors({ email: 'Email is required' })
      setTouched({ email: true })
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrors({ email: 'Please enter a valid email address' })
      setTouched({ email: true })
      return
    }

    setLoading(true)
    try {
      await axios.get(import.meta.env.VITE_API_URL + "/api/users/send-otp/"+ email)
      toast.success('OTP sent to your email' + email)
      setErrors({})
      setTouched({})
      setStep('otp')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleResetPassword(e) {

    e.preventDefault()
    const newErrors = {}
    if (!otp.trim()) newErrors.otp = 'OTP is required'
    else if (otp.trim().length !== 6) newErrors.otp = 'OTP must be 6 digits'
    if (!newPassword) newErrors.newPassword = 'New password is required'
    else if (newPassword.length < 4) newErrors.newPassword = 'Password must be at least 4 characters'
    if (!confirmPassword) newErrors.confirmPassword = 'Please confirm your password'
    else if (newPassword !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setTouched({ otp: true, newPassword: true, confirmPassword: true })
      return
    }

    setLoading(true)
    try {
      await axios.post(import.meta.env.VITE_API_URL + '/api/users/change-password', {
        email,
        otp: otp.trim(),
        newPassword,
      })
      toast.success('Password changed successfully! Please login with your new password.')
      navigate('/login')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = (name) =>
    `w-full px-4 py-3 rounded-xl border text-sm transition-all duration-200 outline-none ${
      errors[name] && touched[name]
        ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200'
        : 'border-[#E2E8F0] focus:border-[#0342B3] focus:ring-2 focus:ring-[#0342B3]/20'
    }`

  const labelClass = 'block text-sm font-medium text-[#0F172A] mb-1.5'

  return (
    <div className="min-h-screen flex bg-[#FCFCFC] relative">
      <Link
        to="/"
        className="fixed top-20 lg:top-2 left-4 sm:left-6 lg:left-8 z-50 w-10 h-10 flex items-center justify-center rounded-xl text-surface shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200"
        aria-label="Go back to home"
      >
        <ArrowLeft size={18} />
      </Link>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex w-[45%] xl:w-[42%] relative overflow-hidden"
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/run3.png')" }}
        />
        <div className="absolute inset-0 bg-linear-to-b from-[#0342B3]/90 via-[#0342B3]/75 to-[#0342B3]/95" />
        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">
          <div>
            <h2 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight mb-4">
              Reset Your
              <br />
              Password
            </h2>
            <p className="text-white/80 text-base xl:text-lg max-w-md leading-relaxed">
              Don&apos;t worry, we&apos;ll help you get back into your account securely.
            </p>
          </div>
          <div className="space-y-5">
            {[
              { icon: Trophy, text: 'Participate in Championships' },
              { icon: BarChart3, text: 'Track Performance' },
              { icon: Zap, text: 'View Official Results' },
            ].map((item) => {
              const Icon = item.icon
              return (
                <div key={item.text} className="flex items-center gap-3 text-white/90">
                  <div className="w-10 h-10 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
                    <Icon size={18} className="text-white" />
                  </div>
                  <span className="text-sm font-medium">{item.text}</span>
                </div>
              )
            })}
          </div>
        </div>
      </motion.div>

      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-8 lg:py-6">
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-full max-w-120 bg-white rounded-[20px] shadow-[0_8px_40px_rgba(0,0,0,0.08)] p-8 sm:p-10 lg:p-12"
        >
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] mb-2">
              {step === 'email' ? 'Forgot Password' : 'Reset Password'}
            </h1>
            <p className="text-[#64748B] text-sm leading-relaxed">
              {step === 'email'
                ? 'Enter your email address and we\'ll send you a verification code.'
                : `We sent a 6-digit code to ${email}`}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {step === 'email' ? (
              <motion.form
                key="email"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                onSubmit={handleSendOTP}
                noValidate
                className="space-y-4"
              >
                <div>
                  <label htmlFor="email" className={labelClass}>Email Address</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B] pointer-events-none" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        if (touched.email) setErrors((prev) => ({ ...prev, email: '' }))
                      }}
                      onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
                      placeholder="Enter your email address"
                      className={`${inputClass('email')} pl-10`}
                    />
                  </div>
                  {errors.email && touched.email && (
                    <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-[#0342B3] text-white font-semibold rounded-xl hover:bg-primary-dark transition-all duration-200 shadow-lg shadow-[#0342B3]/20 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending OTP...' : 'Send Verification Code'}
                </motion.button>
              </motion.form>
            ) : (
              <motion.form
                key="otp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                onSubmit={handleResetPassword}
                noValidate
                className="space-y-4"
              >
                <div>
                  <label htmlFor="otp" className={labelClass}>Verification Code</label>
                  <div className="relative">
                    <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B] pointer-events-none" />
                    <input
                      id="otp"
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '')
                        setOtp(val)
                        if (touched.otp) setErrors((prev) => ({ ...prev, otp: '' }))
                      }}
                      onBlur={() => setTouched((prev) => ({ ...prev, otp: true }))}
                      placeholder="Enter 6-digit code"
                      className={`${inputClass('otp')} pl-10 tracking-[0.3em] text-center text-base font-semibold`}
                    />
                  </div>
                  {errors.otp && touched.otp && (
                    <p className="mt-1 text-xs text-red-500">{errors.otp}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="newPassword" className={labelClass}>New Password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B] pointer-events-none" />
                    <input
                      id="newPassword"
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value)
                        if (touched.newPassword) setErrors((prev) => ({ ...prev, newPassword: '' }))
                      }}
                      onBlur={() => setTouched((prev) => ({ ...prev, newPassword: true }))}
                      placeholder="Create a new password"
                      className={`${inputClass('newPassword')} pl-10 pr-10`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#0F172A] transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.newPassword && touched.newPassword && (
                    <p className="mt-1 text-xs text-red-500">{errors.newPassword}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className={labelClass}>Confirm Password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B] pointer-events-none" />
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value)
                        if (touched.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: '' }))
                      }}
                      onBlur={() => setTouched((prev) => ({ ...prev, confirmPassword: true }))}
                      placeholder="Confirm your new password"
                      className={`${inputClass('confirmPassword')} pl-10 pr-10`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#0F172A] transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.confirmPassword && touched.confirmPassword && (
                    <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-[#0342B3] text-white font-semibold rounded-xl hover:bg-primary-dark transition-all duration-200 shadow-lg shadow-[#0342B3]/20 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? 'Resetting Password...' : 'Reset Password'}
                </motion.button>

                <button
                  type="button"
                  onClick={() => {
                    setStep('email')
                    setOtp('')
                    setNewPassword('')
                    setConfirmPassword('')
                    setErrors({})
                    setTouched({})
                  }}
                  className="w-full text-sm font-medium text-[#0342B3] hover:underline py-1"
                >
                  Change email address
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          <p className="text-center text-sm text-[#64748B] mt-6">
            Remember your password?{' '}
            <Link to="/login" className="text-[#0342B3] font-semibold hover:underline">Login</Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
