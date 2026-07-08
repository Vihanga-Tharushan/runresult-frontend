import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

const steps = [
  { id: 1, label: 'Athlete Information' },
  { id: 2, label: 'Event Selection' },
  { id: 3, label: 'Payment' },
  { id: 4, label: 'Confirmation' },
]

export default function RegistrationStepper({ currentStep }) {
  return (
    <div className="mb-8 lg:mb-10">
      <div className="hidden sm:flex items-center justify-between">
        {steps.map((step, i) => {
          const isCompleted = currentStep > step.id
          const isActive = currentStep === step.id
          const isLast = i === steps.length - 1

          return (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <motion.div
                  initial={false}
                  animate={{
                    backgroundColor: isCompleted || isActive ? '#0342B3' : '#E2E8F0',
                    scale: isActive ? 1.1 : 1,
                  }}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-shadow ${
                    isCompleted || isActive ? 'shadow-md shadow-primary/20' : ''
                  }`}
                >
                  {isCompleted ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    >
                      <Check size={18} className="text-white" />
                    </motion.div>
                  ) : (
                    <span className={isActive ? 'text-white' : 'text-[#64748B]'}>{step.id}</span>
                  )}
                </motion.div>
                <span className={`mt-2 text-xs font-medium whitespace-nowrap ${
                  isActive ? 'text-primary' : isCompleted ? 'text-primary' : 'text-[#64748B]'
                }`}>
                  {step.label}
                </span>
              </div>
              {!isLast && (
                <div className="flex-1 h-px mx-4 lg:mx-6 self-start mt-5">
                  <motion.div
                    initial={{ width: '0%' }}
                    animate={{ width: isCompleted ? '100%' : '0%' }}
                    transition={{ duration: 0.4 }}
                    className="h-full bg-primary"
                  />
                  <div className="w-full h-px bg-gray-200 -mt-px" />
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="sm:hidden">
        <div className="flex items-center justify-center gap-2 mb-2">
          {steps.map((step, i) => {
            const isCompleted = currentStep > step.id
            const isActive = currentStep === step.id
            return (
              <div key={step.id} className="flex items-center gap-2">
                <motion.div
                  animate={{
                    backgroundColor: isCompleted || isActive ? '#0342B3' : '#E2E8F0',
                  }}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                    isActive ? 'shadow-md shadow-primary/20' : ''
                  }`}
                >
                  {isCompleted ? (
                    <Check size={14} className="text-white" />
                  ) : (
                    <span className={isActive ? 'text-white' : 'text-[#64748B]'}>{step.id}</span>
                  )}
                </motion.div>
                {i < steps.length - 1 && (
                  <div className={`w-8 h-0.5 rounded ${isCompleted ? 'bg-primary' : 'bg-gray-200'}`} />
                )}
              </div>
            )
          })}
        </div>
        <p className="text-center text-sm font-medium text-primary">
          Step {currentStep} of {steps.length}: {steps[currentStep - 1].label}
        </p>
      </div>
    </div>
  )
}
