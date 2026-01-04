import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useGame } from '../../context/GameContext'
import { processGuesses } from '../../lib/pointsCalculator'
import { Avatar } from './Avatar'
import { Button } from './Button'

interface RoundResultsProps {
  onNextRound?: () => void
}

export function RoundResults({ onNextRound }: RoundResultsProps) {
  const { t } = useTranslation()
  const { room, currentRound, guesses, isHost } = useGame()

  if (!room || !currentRound) return null

  const picker = room.players.find((p) => p.id === currentRound.pickerId)
  if (!picker) return null

  // Calculate points for all guesses
  const phaseDuration = 30000 // 30 seconds for guessing
  const guessingStartTime = currentRound.guessingStartedAt || Date.now()
  const guessResults = processGuesses(guesses, guessingStartTime, phaseDuration)

  const correctGuesses = guessResults.filter((g) => g.isCorrect)
  const totalPointsAwarded = guessResults.reduce((sum, g) => sum + g.points, 0)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6"
    >
      {/* Picker reveal */}
      <div className="bg-gradient-to-r from-primary-500/20 to-primary-600/20 border border-primary-500/30 rounded-lg p-6 text-center">
        <p className="text-xs font-semibold text-primary-500 uppercase tracking-wide mb-3">
          The Picker Was...
        </p>
        <div className="flex items-center justify-center gap-3">
          <Avatar avatarId={picker.avatarId} size="xl" />
          <div>
            <p className="text-3xl font-bold text-primary-500">{picker.name}</p>
            <p className="text-xs text-[var(--text-tertiary)]">Fooled {correctGuesses.length} player(s)</p>
          </div>
        </div>
      </div>

      {/* Results summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[var(--surface)] rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-primary-500">{correctGuesses.length}</p>
          <p className="text-xs text-[var(--text-tertiary)] mt-1">Guessed Correctly</p>
        </div>
        <div className="bg-[var(--surface)] rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-primary-500">+{totalPointsAwarded}</p>
          <p className="text-xs text-[var(--text-tertiary)] mt-1">Points Awarded</p>
        </div>
      </div>

      {/* Detailed results */}
      {correctGuesses.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-2"
        >
          <p className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wide">
            🎯 Correct Guesses
          </p>
          {correctGuesses.map((result, idx) => {
            const guesser = room.players.find((p) => p.id === result.playerId)
            if (!guesser) return null

            return (
              <motion.div
                key={result.playerId}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 + idx * 0.1 }}
                className="flex items-center justify-between bg-[var(--surface-elevated)] rounded-lg p-3"
              >
                <div className="flex items-center gap-2">
                  <Avatar avatarId={guesser.avatarId} size="sm" />
                  <div>
                    <p className="text-sm font-medium">{guesser.name}</p>
                    <p className="text-xs text-[var(--text-tertiary)]">Speed: {result.speed}/100</p>
                  </div>
                </div>
                <p className="text-lg font-bold text-green-500">+{result.points}</p>
              </motion.div>
            )
          })}
        </motion.div>
      ) : (
        <div className="bg-[var(--surface)] rounded-lg p-4 text-center">
          <p className="text-[var(--text-tertiary)] text-sm">
            No one guessed correctly! {picker.name} fooled everyone! 🎉
          </p>
        </div>
      )}

      {/* Wrong guesses */}
      {guessResults.length > correctGuesses.length && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-2"
        >
          <p className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wide">
            ❌ Wrong Guesses
          </p>
          {guessResults
            .filter((g) => !g.isCorrect)
            .map((result, idx) => {
              const guesser = room.players.find((p) => p.id === result.playerId)
              if (!guesser) return null

              return (
                <motion.div
                  key={result.playerId}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 + idx * 0.1 }}
                  className="flex items-center justify-between bg-[var(--surface)]/50 rounded-lg p-3 opacity-60"
                >
                  <div className="flex items-center gap-2">
                    <Avatar avatarId={guesser.avatarId} size="sm" />
                    <p className="text-sm font-medium">{guesser.name}</p>
                  </div>
                  <p className="text-sm text-[var(--text-tertiary)]">0 points</p>
                </motion.div>
              )
            })}
        </motion.div>
      )}

      {/* Next button */}
      {isHost && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Button onClick={onNextRound} fullWidth variant="primary">
            {t('common.next')}
          </Button>
        </motion.div>
      )}
    </motion.div>
  )
}
