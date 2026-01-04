import type { ReactNode } from 'react'

interface SettingsRowProps {
  label: string
  description?: string
  children: ReactNode
}

export function SettingsRow({ label, description, children }: SettingsRowProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-[var(--border)] last:border-b-0">
      <div className="flex-1">
        <div className="font-medium text-[var(--text-primary)]">{label}</div>
        {description && (
          <div className="text-sm text-[var(--text-tertiary)]">{description}</div>
        )}
      </div>
      <div className="flex-shrink-0 ml-4">{children}</div>
    </div>
  )
}

interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
}

export function Toggle({ checked, onChange }: ToggleProps) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`
        relative w-12 h-7 rounded-full transition-colors duration-200
        ${checked ? 'bg-primary-500' : 'bg-[var(--text-tertiary)]'}
      `}
    >
      <span
        className={`
          absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow
          transition-transform duration-200
          ${checked ? 'translate-x-5' : 'translate-x-0'}
        `}
      />
    </button>
  )
}

interface SliderProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
}

export function Slider({ value, onChange, min = 0, max = 1, step = 0.01 }: SliderProps) {
  const percentage = ((value - min) / (max - min)) * 100

  return (
    <div className="relative w-32">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer bg-[var(--border)]"
        style={{
          background: `linear-gradient(to right, var(--color-primary-500) ${percentage}%, var(--border) ${percentage}%)`
        }}
      />
    </div>
  )
}

interface SegmentedControlProps<T extends string> {
  options: { value: T; label: string }[]
  value: T
  onChange: (value: T) => void
}

export function SegmentedControl<T extends string>({ options, value, onChange }: SegmentedControlProps<T>) {
  return (
    <div className="inline-flex p-1 bg-[var(--surface-elevated)] rounded-lg border border-[var(--border)]">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`
            px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200
            ${value === option.value
              ? 'bg-[var(--surface)] text-[var(--text-primary)] shadow-sm'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }
          `}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
