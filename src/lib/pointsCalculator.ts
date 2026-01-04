import type { Guess } from '../types'

export interface GuessResult {
  playerId: string
  guessedPlayerId: string
  isCorrect: boolean
  timestamp: number
  speed: number // 0-100, where 100 is fastest (first to guess)
  points: number // base + speed bonus
}

/**
 * Calculate speed score based on timing within the guessing phase
 * @param phaseStartTime - When the guessing phase started (ms)
 * @param guessTime - When the guess was made (ms)
 * @param phaseDuration - How long the guessing phase lasts (ms)
 * @returns Speed score 0-100 (100 = fastest/first)
 */
export const calculateSpeedScore = (
  phaseStartTime: number,
  guessTime: number,
  phaseDuration: number
): number => {
  const elapsedTime = guessTime - phaseStartTime
  const speedRatio = Math.max(0, 1 - elapsedTime / phaseDuration)
  return Math.round(speedRatio * 100)
}

/**
 * Calculate points for a guess
 * @param isCorrect - Whether the guess was correct
 * @param speedScore - Speed score (0-100)
 * @returns Total points awarded
 */
export const calculatePoints = (isCorrect: boolean, speedScore: number): number => {
  if (!isCorrect) {
    // No points for incorrect guesses
    return 0
  }

  // Base 10 points for correct guess + speed bonus (0-10 points)
  const speedBonus = Math.round((speedScore / 100) * 10)
  return 10 + speedBonus
}

/**
 * Process all guesses and calculate results
 */
export const processGuesses = (
  guesses: Guess[],
  phaseStartTime: number,
  phaseDuration: number
): GuessResult[] => {
  return guesses.map((guess) => {
    const speed = calculateSpeedScore(phaseStartTime, guess.timestamp, phaseDuration)
    const points = calculatePoints(guess.isCorrect, speed)

    return {
      playerId: guess.playerId,
      guessedPlayerId: guess.guessedPlayerId,
      isCorrect: guess.isCorrect,
      timestamp: guess.timestamp,
      speed,
      points
    }
  })
}
