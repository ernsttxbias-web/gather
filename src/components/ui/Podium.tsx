import { motion } from 'framer-motion'
import { Avatar } from './Avatar'
import type { Player } from '../../types'

interface PodiumProps {
  players: Player[]
}

export function Podium({ players }: PodiumProps) {
  const sorted = [...players].sort((a, b) => b.score - a.score).slice(0, 3)
  const positions = [1, 0, 2]
  const heights = ['h-24', 'h-32', 'h-20']
  const delays = [0.3, 0.1, 0.5]
  const colors = ['bg-gray-300', 'bg-yellow-400', 'bg-amber-600']

  return (
    <div className="flex items-end justify-center gap-2 py-8">
      {positions.map((pos, idx) => {
        const player = sorted[pos]
        if (!player) return null

        return (
          <motion.div
            key={player.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delays[idx], type: 'spring', damping: 15 }}
            className="flex flex-col items-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: delays[idx] + 0.2, type: 'spring' }}
            >
              <Avatar avatarId={player.avatarId} size="lg" />
            </motion.div>
            <span className="mt-2 font-medium text-[var(--text-primary)] text-sm truncate max-w-[80px]">
              {player.name}
            </span>
            <span className="text-xs text-[var(--text-tertiary)]">{player.score} pts</span>
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              transition={{ delay: delays[idx] + 0.1, duration: 0.5 }}
              className={`mt-2 w-20 rounded-t-lg flex items-end justify-center pb-2 ${heights[idx]} ${colors[pos]}`}
            >
              <span className="text-2xl font-bold text-white">{pos + 1}</span>
            </motion.div>
          </motion.div>
        )
      })}
    </div>
  )
}
