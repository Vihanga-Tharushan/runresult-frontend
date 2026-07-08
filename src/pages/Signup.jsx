import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Eye, EyeOff, Info, Trophy, BarChart3, Zap } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'

export default function Signup() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  async function register() {
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    try {
      const response = await axios.post(import.meta.env.VITE_API_URL + "/api/users/", {
        email: form.email,
        password: form.password,
        name: form.fullName,
        role: "athlete"
      })

      toast.success("Registration successful! Please login to continue.")
      navigate("/login")
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed. Please try again.")
      console.error("Registration error:", error)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    if (touched[name]) {
      validateField(name, type === 'checkbox' ? checked : value)
    }
  }

  const handleBlur = (e) => {
    const { name, value, type, checked } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
    validateField(name, type === 'checkbox' ? checked : value)
  }

  const validateField = (name, value) => {
    let error = ''
    switch (name) {
      case 'fullName':
        if (!value.trim()) error = 'Full name is required'
        break
      case 'email':
        if (!value.trim()) error = 'Email is required'
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Please enter a valid email address'
        break
      case 'password':
        if (!value) error = 'Password is required'
        else if (value.length < 4) error = 'Password must be at least 4 characters'
       
        if (!error && form.confirmPassword && value !== form.confirmPassword) {
          setErrors((prev) => ({ ...prev, confirmPassword: 'Passwords do not match' }))
        } else {
          setErrors((prev) => {
            const { confirmPassword, ...rest } = prev
            return form.confirmPassword ? { ...rest } : rest
          })
        }
        break
      case 'confirmPassword':
        if (!value) error = 'Please confirm your password'
        else if (value !== form.password) error = 'Passwords do not match'
        break
      case 'agreeToTerms':
        if (!value) error = 'You must agree to the terms and conditions'
        break
      default:
        break
    }
    setErrors((prev) => {
      if (error) return { ...prev, [name]: error }
      const { [name]: _, ...rest } = prev
      return rest
    })
    return error
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const allFields = ['fullName', 'email', 'password', 'confirmPassword', 'agreeToTerms']
    const newErrors = {}
    let hasError = false
    allFields.forEach((field) => {
      const val = field === 'agreeToTerms' ? form[field] : form[field]
      const err = validateField(field, val)
      if (err) {
        newErrors[field] = err
        hasError = true
      }
    })
    setTouched(Object.fromEntries(allFields.map((f) => [f, true])))
    if (hasError) return
    register()
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
              Join
              <br />
              RUNRESULT
            </h2>
            <p className="text-white/80 text-base xl:text-lg max-w-md leading-relaxed">
              Create your athlete account and participate in championships, track your performances, and access official results from anywhere.
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

      <div className="flex-1 flex items-start justify-center px-4 sm:px-6 py-8 lg:py-6">
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-full max-w-130 bg-white rounded-[20px] shadow-[0_8px_40px_rgba(0,0,0,0.08)] p-8 sm:p-10 lg:p-12"
        >
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] mb-2">
              Create Athlete Account
            </h1>
            <p className="text-[#64748B] text-sm leading-relaxed">
              Sign up to RUNRESULT and start participating in sports championships.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white border border-[#E2E8F0] rounded-xl text-sm font-semibold text-[#0F172A] hover:shadow-md hover:border-gray-300 transition-all duration-200 mb-6"
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </motion.button>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-[#E2E8F0]" />
            <span className="text-xs font-medium text-[#64748B]">OR</span>
            <div className="flex-1 h-px bg-[#E2E8F0]" />
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <label htmlFor="fullName" className={labelClass}>Full Name</label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                autoComplete="given-name"
                value={form.fullName}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter your full name"
                className={`${inputClass('fullName')} ${errors.fullName && touched.fullName ? 'pr-10' : ''}`}
              />
              {errors.fullName && touched.fullName && (
                <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className={labelClass}>Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter your email address"
                className={inputClass('email')}
              />
              {errors.email && touched.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email}</p>
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="password" className={labelClass}>Password</label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Create a password"
                    className={`${inputClass('password')} pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#0F172A] transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && touched.password && (
                  <p className="mt-1 text-xs text-red-500">{errors.password}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className={labelClass}>Confirm Password</label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={form.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Confirm your password"
                    className={`${inputClass('confirmPassword')} pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#0F172A] transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && touched.confirmPassword && (
                  <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            <div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={form.agreeToTerms}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="mt-0.5 w-4 h-4 rounded border-[#E2E8F0] text-[#0342B3] focus:ring-[#0342B3]/30 accent-[#0342B3]"
                />
                <span className="text-sm text-[#64748B] leading-relaxed">
                  I agree to the{' '}
                  <Link to="/terms" className="text-[#0342B3] font-medium hover:underline">Terms & Conditions</Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-[#0342B3] font-medium hover:underline">Privacy Policy</Link>.
                </span>
              </label>
              {errors.agreeToTerms && touched.agreeToTerms && (
                <p className="mt-1 text-xs text-red-500">{errors.agreeToTerms}</p>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-3.5 bg-[#0342B3] text-white font-semibold rounded-xl hover:bg-primary-dark transition-all duration-200 shadow-lg shadow-[#0342B3]/20 text-sm"
            >
              Create Account
            </motion.button>
          </form>

          <p className="text-center text-sm text-[#64748B] mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-[#0342B3] font-semibold hover:underline">Login</Link>
          </p>
          
        </motion.div>
      </div>
    </div>
  )
}
