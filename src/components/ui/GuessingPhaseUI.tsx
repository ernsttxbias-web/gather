import { useState } from 'react'
import { useGame } from '../../context/GameContext'
import { Avatar } from './Avatar'
import { Button } from './Button'
import type { Player } from '../../types'

export function GuessingPhaseUI() {
  const { room, currentRound, isPicker, submitGuess } = useGame()
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!room || !currentRound) return null

  // Filter out the picker from guessing options
  const guessingOptions = room.players.filter((p: Player) => p.id !== currentRound.pickerId)

  const handleSubmitGuess = async () => {
    if (!selectedPlayerId) return

    setIsSubmitting(true)
    try {
      await submitGuess(selectedPlayerId)
      setSelectedPlayerId(null)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isPicker) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96">
        <p className="text-lg font-semibold text-[var(--text-primary)] mb-2">Your Turn to Share! 🎬</p>
        <p className="text-sm text-[var(--text-tertiary)]">Wait for other players to guess...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-[var(--text-tertiary)] uppercase tracking-wide mb-4">
          Who liked this video?
        </p>
        
        <div className="grid grid-cols-3 gap-3">
          {guessingOptions.map((player: Player) => (
            <button
              key={player.id}
              onClick={() => setSelectedPlayerId(player.id)}
              disabled={isSubmitting}
              className={`flex flex-col items-center gap-2 p-4 rounded-lg transition-all ${
                selectedPlayerId === player.id
                  ? 'bg-primary-500 ring-2 ring-primary-600'
                  : 'bg-[var(--surface-elevated)] hover:bg-[var(--surface-elevated)]/80'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <Avatar avatarId={player.avatarId} size="lg" />
              <span className="text-xs font-medium text-center line-clamp-2">{player.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <Button
          onClick={handleSubmitGuess}
          disabled={!selectedPlayerId || isSubmitting}
          fullWidth
          variant="primary"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Guess'}
        </Button>
      </div>
    </div>
  )
}
