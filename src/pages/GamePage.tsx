import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { Shell } from '../components/layout/Shell'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card } from '../components/ui/Card'
import { PlayerList } from '../components/ui/PlayerList'
import { Countdown } from '../components/ui/Countdown'
import { TikTokCard, validateTikTokUrl } from '../components/ui/TikTokCard'
import { Avatar } from '../components/ui/Avatar'
import { useGame } from '../context/GameContext'
import { toast } from '../components/ui/Toast'
import type { Player } from '../types'

export function GamePage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { code } = useParams<{ code: string }>()
  const {
    room,
    currentRound,
    guesses,
    myPlayerId,
    isPicker,
    hasGuessed,
    submitTikTokLink,
    submitGuess
  } = useGame()

  const [tiktokUrl, setTiktokUrl] = useState('')
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (room?.status === 'finished') {
      navigate(`/room/${code}/results`)
    }
  }, [room?.status, code, navigate])

  const handleSubmitLink = async () => {
    if (!validateTikTokUrl(tiktokUrl)) {
      toast('Invalid TikTok URL', 'error')
      return
    }
    setIsSubmitting(true)
    try {
      await submitTikTokLink(tiktokUrl)
    } catch {
      toast(t('common.error'), 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmitGuess = async () => {
    if (!selectedPlayerId) return
    setIsSubmitting(true)
    try {
      await submitGuess(selectedPlayerId)
    } catch {
      toast(t('common.error'), 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePlayerSelect = (player: Player) => {
    if (player.id === myPlayerId || player.id === currentRound?.pickerId) return
    setSelectedPlayerId(player.id)
  }

  if (!room || !currentRound) {
    return (
      <Shell>
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-[var(--text-tertiary)]">{t('common.loading')}</p>
        </div>
      </Shell>
    )
  }

  const picker = room.players.find((p) => p.id === currentRound.pickerId)
  const otherPlayers = room.players.filter((p) => p.id !== currentRound.pickerId)

  return (
    <Shell
      topbarContent={
        <div className="flex items-center justify-between w-full">
          <span className="text-sm text-[var(--text-tertiary)]">
            {t('game.round')} {currentRound.roundNumber} {t('game.of')} {room.totalRounds}
          </span>
          <span className="text-lg font-semibold">{t('app.name')}</span>
          <div className="w-16" />
        </div>
      }
    >
      <AnimatePresence mode="wait">
        {currentRound.phase === 'picking' && (
          <motion.div
            key="picking"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {isPicker ? (
              <>
                <Card className="text-center py-8">
                  <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                    {t('game.yourTurn')}
                  </h2>
                  <p className="text-[var(--text-secondary)]">
                    Share a TikTok video you liked
                  </p>
                </Card>
                <div className="space-y-4">
                  <Input
                    placeholder={t('game.enterLink')}
                    value={tiktokUrl}
                    onChange={(e) => setTiktokUrl(e.target.value)}
                  />
                  <Button
                    fullWidth
                    onClick={handleSubmitLink}
                    disabled={isSubmitting || !tiktokUrl}
                  >
                    {t('game.submit')}
                  </Button>
                </div>
              </>
            ) : (
              <Card className="text-center py-12">
                <Avatar avatarId={picker?.avatarId || 0} size="xl" />
                <p className="mt-4 text-lg font-medium text-[var(--text-primary)]">
                  {picker?.name}
                </p>
                <p className="text-[var(--text-secondary)]">is choosing a video...</p>
              </Card>
            )}
          </motion.div>
        )}

        {currentRound.phase === 'watching' && currentRound.tiktokUrl && (
          <motion.div
            key="watching"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <Card className="text-center py-6">
              <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
                {t('game.watching')}
              </h2>
              {currentRound.phaseEndsAt && (
                <div className="flex justify-center">
                  <Countdown endTime={currentRound.phaseEndsAt} size="lg" />
                </div>
              )}
            </Card>
            <TikTokCard url={currentRound.tiktokUrl} />
          </motion.div>
        )}

        {currentRound.phase === 'guessing' && (
          <motion.div
            key="guessing"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <Card className="text-center py-4">
              <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                {t('game.guessing')}
              </h2>
              {currentRound.phaseEndsAt && (
                <div className="flex justify-center mt-4">
                  <Countdown endTime={currentRound.phaseEndsAt} size="md" />
                </div>
              )}
            </Card>

            {isPicker ? (
              <Card className="text-center py-8">
                <p className="text-[var(--text-secondary)]">{t('game.waiting')}</p>
                <p className="text-sm text-[var(--text-tertiary)] mt-2">
                  {guesses.length} / {otherPlayers.length} guessed
                </p>
              </Card>
            ) : hasGuessed ? (
              <Card className="text-center py-8">
                <p className="text-[var(--text-secondary)]">{t('game.waiting')}</p>
              </Card>
            ) : (
              <>
                <p className="text-sm text-[var(--text-tertiary)] text-center">
                  {t('game.selectPlayer')}
                </p>
                <PlayerList
                  players={otherPlayers}
                  currentPickerId={currentRound.pickerId}
                  onPlayerClick={handlePlayerSelect}
                  selectedPlayerId={selectedPlayerId || undefined}
                />
                <Button
                  fullWidth
                  onClick={handleSubmitGuess}
                  disabled={isSubmitting || !selectedPlayerId}
                >
                  {t('common.confirm')}
                </Button>
              </>
            )}
          </motion.div>
        )}

        {currentRound.phase === 'reveal' && (
          <motion.div
            key="reveal"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="space-y-6"
          >
            <Card className="text-center py-8">
              <p className="text-lg text-[var(--text-secondary)] mb-4">{t('game.reveal')}</p>
              <Avatar avatarId={picker?.avatarId || 0} size="xl" />
              <p className="mt-4 text-2xl font-bold text-[var(--text-primary)]">
                {picker?.name}
              </p>
            </Card>

            <div className="space-y-2">
              {guesses.map((guess) => {
                const guesser = room.players.find((p) => p.id === guess.playerId)
                const guessed = room.players.find((p) => p.id === guess.guessedPlayerId)
                return (
                  <Card key={guess.playerId} padding="sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar avatarId={guesser?.avatarId || 0} size="sm" />
                        <span className="text-sm text-[var(--text-primary)]">{guesser?.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-[var(--text-tertiary)]">guessed</span>
                        <Avatar avatarId={guessed?.avatarId || 0} size="sm" />
                        <span
                          className={`text-sm font-medium ${
                            guess.isCorrect ? 'text-success' : 'text-error'
                          }`}
                        >
                          {guess.isCorrect ? t('game.correct') : t('game.wrong')}
                        </span>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Shell>
  )
}
