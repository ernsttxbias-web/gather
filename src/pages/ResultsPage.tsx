import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Shell } from '../components/layout/Shell'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Podium } from '../components/ui/Podium'
import { PlayerList } from '../components/ui/PlayerList'
import { StatCard } from '../components/ui/StatCard'
import { Confetti } from '../components/ui/Confetti'
import { useGame } from '../context/GameContext'

export function ResultsPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { code } = useParams<{ code: string }>()
  const { room, leaveRoom } = useGame()
  const [showConfetti, setShowConfetti] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000)
    return () => clearTimeout(timer)
  }, [])

  const handlePlayAgain = () => {
    navigate(`/room/${code}`)
  }

  const handleLeave = async () => {
    await leaveRoom()
    navigate('/')
  }

  const handleShare = async () => {
    if (!room) return
    const winner = [...room.players].sort((a, b) => b.score - a.score)[0]
    const text = `I just played PartyHub! ${winner.name} won with ${winner.score} points!`
    
    if (navigator.share) {
      await navigator.share({ text })
    } else {
      await navigator.clipboard.writeText(text)
    }
  }

  if (!room) {
    return (
      <Shell>
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-[var(--text-tertiary)]">{t('common.loading')}</p>
        </div>
      </Shell>
    )
  }

  const sortedPlayers = [...room.players].sort((a, b) => b.score - a.score)
  const winner = sortedPlayers[0]

  return (
    <Shell
      topbarContent={
        <span className="text-lg font-semibold">{t('results.title')}</span>
      }
    >
      <Confetti active={showConfetti} />
      
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="text-center py-4">
            <p className="text-sm text-[var(--text-tertiary)] mb-2">{t('results.winner')}</p>
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">{winner.name}</h2>
            <p className="text-lg text-primary-500">{winner.score} {t('game.points')}</p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-sm font-medium text-[var(--text-tertiary)] uppercase tracking-wide mb-3">
            {t('results.podium')}
          </h2>
          <Card padding="none">
            <Podium players={room.players} />
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-sm font-medium text-[var(--text-tertiary)] uppercase tracking-wide mb-3">
            {t('results.rankings')}
          </h2>
          <PlayerList players={sortedPlayers} showScores />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-sm font-medium text-[var(--text-tertiary)] uppercase tracking-wide mb-3">
            {t('results.stats')}
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <StatCard label={t('results.totalRounds')} value={room.totalRounds} />
            <StatCard label="Players" value={room.players.length} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-3 pt-4"
        >
          <Button fullWidth onClick={handlePlayAgain}>
            {t('results.playAgain')}
          </Button>
          <Button fullWidth variant="secondary" onClick={handleShare}>
            {t('results.share')}
          </Button>
          <Button fullWidth variant="ghost" onClick={handleLeave}>
            {t('room.leave')}
          </Button>
        </motion.div>
      </div>
    </Shell>
  )
}
