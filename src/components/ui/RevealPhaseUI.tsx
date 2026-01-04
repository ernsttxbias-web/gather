import { useGame } from '../../context/GameContext'
import { Avatar } from './Avatar'
import { processGuesses } from '../../lib/pointsCalculator'

export function RevealPhaseUI() {
  const { room, currentRound, guesses } = useGame()

  if (!room || !currentRound) return null

  // Find the picker
  const picker = room.players.find((p) => p.id === currentRound.pickerId)
  if (!picker) return null

  // Calculate points for all guesses
  const phaseDuration = 30000 // 30 seconds for guessing
  const guessingStartTime = currentRound.guessingStartedAt || Date.now()
  const guessResults = processGuesses(guesses, guessingStartTime, phaseDuration)

  // Get players who guessed correctly
  const correctGuesses = guessResults.filter((g) => g.isCorrect)

  return (
    <div className="space-y-6">
      {/* Picker reveal */}
      <div className="bg-[var(--surface)] rounded-lg p-6 text-center">
        <p className="text-sm text-[var(--text-tertiary)] mb-3">It was...</p>
        <div className="flex items-center justify-center gap-3 mb-2">
          <Avatar avatarId={picker.avatarId} size="xl" />
          <div>
            <p className="text-2xl font-bold text-[var(--text-primary)]">{picker.name}</p>
            <p className="text-xs text-[var(--text-tertiary)]">The Picker</p>
          </div>
        </div>
      </div>

      {/* Results */}
      {correctGuesses.length > 0 ? (
        <div className="space-y-3">
          <p className="text-sm font-medium text-[var(--text-tertiary)] uppercase tracking-wide">
            Correct Guesses 🎯
          </p>
          {correctGuesses.map((result) => {
            const guesser = room.players.find((p) => p.id === result.playerId)
            if (!guesser) return null

            return (
              <div
                key={result.playerId}
                className="bg-[var(--surface-elevated)] rounded-lg p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Avatar avatarId={guesser.avatarId} size="md" />
                  <div>
                    <p className="font-medium text-[var(--text-primary)]">{guesser.name}</p>
                    <p className="text-xs text-[var(--text-tertiary)]">Speed: {result.speed}/100</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-primary-500">+{result.points}</p>
                  <p className="text-xs text-[var(--text-tertiary)]">points</p>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="bg-[var(--surface)] rounded-lg p-6 text-center">
          <p className="text-[var(--text-tertiary)]">No one guessed correctly! 😅</p>
        </div>
      )}

      {/* Incorrect guesses */}
      {guessResults.length > correctGuesses.length && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-[var(--text-tertiary)] uppercase tracking-wide">
            Wrong Guesses
          </p>
          {guessResults
            .filter((g) => !g.isCorrect)
            .map((result) => {
              const guesser = room.players.find((p) => p.id === result.playerId)
              if (!guesser) return null

              return (
                <div
                  key={result.playerId}
                  className="bg-[var(--surface-elevated)]/50 rounded-lg p-4 flex items-center justify-between opacity-60"
                >
                  <div className="flex items-center gap-3">
                    <Avatar avatarId={guesser.avatarId} size="md" />
                    <p className="font-medium text-[var(--text-primary)]">{guesser.name}</p>
                  </div>
                  <p className="text-sm text-[var(--text-tertiary)]">0 points</p>
                </div>
              )
            })}
        </div>
      )}
    </div>
  )
}
