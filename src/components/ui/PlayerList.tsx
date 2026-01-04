import { motion } from 'framer-motion'
import { Avatar } from './Avatar'
import type { Player } from '../../types'
import { useTranslation } from 'react-i18next'

interface PlayerListProps {
  players: Player[]
  currentPickerId?: string
  onPlayerClick?: (player: Player) => void
  selectedPlayerId?: string
  showScores?: boolean
  disabled?: boolean
}

export function PlayerList({
  players,
  currentPickerId,
  onPlayerClick,
  selectedPlayerId,
  showScores = false,
  disabled = false
}: PlayerListProps) {
  const { t } = useTranslation()

  return (
    <div className="space-y-2">
      {players.map((player, index) => (
        <motion.div
          key={player.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          onClick={() => !disabled && onPlayerClick?.(player)}
          className={`
            flex items-center gap-3 p-3 rounded-xl
            bg-[var(--surface-elevated)]
            border transition-all duration-200
            ${selectedPlayerId === player.id ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-[var(--border)]'}
            ${onPlayerClick && !disabled ? 'cursor-pointer hover:border-primary-300' : ''}
            ${disabled ? 'opacity-50' : ''}
          `}
        >
          <Avatar avatarId={player.avatarId} size="md" isOnline={player.isOnline} showStatus />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium text-[var(--text-primary)] truncate">{player.name}</span>
              {player.isHost && (
                <span className="px-2 py-0.5 text-xs font-medium bg-warning/10 text-warning rounded-full">
                  {t('room.host')}
                </span>
              )}
              {player.id === currentPickerId && (
                <span className="px-2 py-0.5 text-xs font-medium bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 rounded-full">
                  Picker
                </span>
              )}
            </div>
            {!player.isOnline && (
              <span className="text-xs text-[var(--text-tertiary)]">Offline</span>
            )}
          </div>
          {showScores && (
            <div className="text-right">
              <span className="text-lg font-semibold text-[var(--text-primary)]">{player.score}</span>
              <span className="text-xs text-[var(--text-tertiary)] ml-1">{t('game.points')}</span>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  )
}
