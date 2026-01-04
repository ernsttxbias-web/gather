import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface CountdownProps {
  endTime: Date
  size?: 'sm' | 'md' | 'lg'
  onComplete?: () => void
}

export function Countdown({ endTime, size = 'md', onComplete }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState(0)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    const end = endTime.getTime()
    const now = Date.now()
    const initial = Math.max(0, Math.ceil((end - now) / 1000))
    setTotal(initial)
    setTimeLeft(initial)

    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((end - Date.now()) / 1000))
      setTimeLeft(remaining)
      if (remaining === 0) {
        clearInterval(interval)
        onComplete?.()
      }
    }, 100)

    return () => clearInterval(interval)
  }, [endTime, onComplete])

  const progress = total > 0 ? timeLeft / total : 0
  const circumference = 2 * Math.PI * 45
  const strokeDashoffset = circumference * (1 - progress)

  const sizes = {
    sm: { container: 'w-16 h-16', text: 'text-lg', stroke: 4 },
    md: { container: 'w-24 h-24', text: 'text-2xl', stroke: 5 },
    lg: { container: 'w-32 h-32', text: 'text-4xl', stroke: 6 }
  }

  const { container, text, stroke } = sizes[size]

  return (
    <div className={`relative ${container}`}>
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="var(--border)"
          strokeWidth={stroke}
        />
        <motion.circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke={timeLeft <= 5 ? 'var(--color-error)' : 'var(--color-primary-500)'}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.1 }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.span
          key={timeLeft}
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`font-bold ${text} ${timeLeft <= 5 ? 'text-error' : 'text-[var(--text-primary)]'}`}
        >
          {timeLeft}
        </motion.span>
      </div>
    </div>
  )
}
