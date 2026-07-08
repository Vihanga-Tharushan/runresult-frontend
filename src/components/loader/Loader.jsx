import { motion } from 'framer-motion'

export default function Loader({ fullScreen = true, text = "Loading..." }) {
  const spinnerVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 1.2,
        repeat: Infinity,
        ease: "linear"
      }
    }
  }

  const pulseVariants = {
    animate: {
      scale: [1, 1.08, 1],
      opacity: [0.8, 1, 0.8],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }

  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      <motion.div
        variants={spinnerVariants}
        animate="animate"
        className="w-14 h-14"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
          <circle cx="50" cy="50" r="42" stroke="#E2E8F0" strokeWidth="6" />
          <motion.circle
            cx="50" cy="50" r="42"
            stroke="#0342B3"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray="264"
            strokeDashoffset="80"
          />
        </svg>
      </motion.div>

      <motion.img
        src="/logo.png"
        alt="RUNRESULT"
        className="h-8 object-contain"
        variants={pulseVariants}
        animate="animate"
      />

      <motion.p
        className="text-sm text-[#64748B] font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {text}
      </motion.p>
    </div>
  )

  if (!fullScreen) return content

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      {content}
    </div>
  )
}
