import { motion } from 'framer-motion'
import { useGame } from '../../context/GameContext'
import { Avatar } from './Avatar'

interface ScoreboardProps {
  compact?: boolean
}

export function Scoreboard({ compact = false }: ScoreboardProps) {
  const { room } = useGame()

  if (!room) return null

  // Sort players by score (descending)
  const sortedPlayers = [...room.players].sort((a, b) => b.score - a.score)

  if (compact) {
    return (
      <div className="space-y-2">
        {sortedPlayers.map((player) => (
          <div key={player.id} className="flex items-center justify-between px-3 py-2 bg-[var(--surface-elevated)] rounded-lg">
            <div className="flex items-center gap-2">
              <Avatar avatarId={player.avatarId} size="sm" />
              <span className="text-sm font-medium">{player.name}</span>
              {player.isHost && <span className="text-xs text-primary-500 font-semibold">👑</span>}
            </div>
            <span className="text-sm font-bold text-primary-500">{player.score}</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-[var(--text-tertiary)] uppercase tracking-wide">
        Current Scores
      </h3>
      <div className="space-y-2">
        {sortedPlayers.map((player, index) => (
          <motion.div
            key={player.id}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center justify-between p-3 bg-[var(--surface-elevated)] rounded-lg"
          >
            <div className="flex items-center gap-3 flex-1">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-500/20">
                <span className="text-sm font-bold text-primary-500">#{index + 1}</span>
              </div>
              <Avatar avatarId={player.avatarId} size="md" />
              <div>
                <p className="font-medium text-[var(--text-primary)]">{player.name}</p>
                <p className="text-xs text-[var(--text-tertiary)]">
                  {player.isHost && '👑 Host'}
                  {!player.isHost && (player.isOnline ? '🟢 Online' : '⚫ Offline')}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary-500">{player.score}</p>
              <p className="text-xs text-[var(--text-tertiary)]">points</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
