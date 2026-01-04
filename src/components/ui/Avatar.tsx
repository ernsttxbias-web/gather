import { motion } from 'framer-motion'
import { AVATARS } from '../../types'

interface AvatarProps {
  avatarId: number
  size?: 'sm' | 'md' | 'lg' | 'xl'
  isOnline?: boolean
  showStatus?: boolean
  selected?: boolean
  onClick?: () => void
}

export function Avatar({ avatarId, size = 'md', isOnline = true, showStatus = false, selected = false, onClick }: AvatarProps) {
  const avatar = AVATARS[avatarId] || AVATARS[0]
  
  const sizes = {
    sm: 'w-8 h-8 text-lg',
    md: 'w-12 h-12 text-2xl',
    lg: 'w-16 h-16 text-3xl',
    xl: 'w-24 h-24 text-5xl'
  }

  const statusSizes = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
    xl: 'w-5 h-5'
  }

  return (
    <motion.div
      whileHover={onClick ? { scale: 1.05 } : undefined}
      whileTap={onClick ? { scale: 0.95 } : undefined}
      onClick={onClick}
      className={`
        relative inline-flex items-center justify-center rounded-full
        bg-[var(--surface-elevated)]
        border-2 transition-colors duration-200
        ${selected ? 'border-primary-500 ring-2 ring-primary-500/30' : 'border-[var(--border)]'}
        ${sizes[size]}
        ${onClick ? 'cursor-pointer' : ''}
      `}
    >
      <span role="img" aria-label={avatar.name}>{avatar.emoji}</span>
      {showStatus && (
        <span
          className={`
            absolute bottom-0 right-0 rounded-full border-2 border-[var(--surface)]
            ${statusSizes[size]}
            ${isOnline ? 'bg-success' : 'bg-[var(--text-tertiary)]'}
          `}
        />
      )}
    </motion.div>
  )
}

interface AvatarPickerProps {
  selectedId: number
  onSelect: (id: number) => void
}

export function AvatarPicker({ selectedId, onSelect }: AvatarPickerProps) {
  return (
    <div className="grid grid-cols-4 gap-3">
      {AVATARS.map((avatar) => (
        <Avatar
          key={avatar.id}
          avatarId={avatar.id}
          size="lg"
          selected={selectedId === avatar.id}
          onClick={() => onSelect(avatar.id)}
        />
      ))}
    </div>
  )
}
