import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Shell } from '../components/layout/Shell'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { PlayerList } from '../components/ui/PlayerList'
import { useGame } from '../context/GameContext'
import { toast } from '../components/ui/Toast'

export function RoomPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { code } = useParams<{ code: string }>()
  const { room, isHost, startGame, leaveRoom } = useGame()
  const [copied, setCopied] = useState(false)
  const [isStarting, setIsStarting] = useState(false)

  const handleCopyCode = async () => {
    if (code) {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      toast(t('room.copied'), 'success')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleStartGame = async () => {
    if (!room || room.players.length < 3) {
      toast(t('room.minPlayers'), 'error')
      return
    }
    setIsStarting(true)
    try {
      await startGame()
      navigate(`/room/${code}/game`)
    } catch {
      toast(t('common.error'), 'error')
    } finally {
      setIsStarting(false)
    }
  }

  const handleLeave = async () => {
    await leaveRoom()
    navigate('/')
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

  return (
    <Shell
      topbarContent={
        <div className="flex items-center justify-between w-full">
          <button
            onClick={handleLeave}
            className="p-2 -ml-2 rounded-full hover:bg-[var(--surface-elevated)] transition-colors"
          >
            <svg className="w-6 h-6 text-[var(--text-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-lg font-semibold">{t('room.lobby')}</span>
          <button
            onClick={() => navigate('/settings')}
            className="p-2 -mr-2 rounded-full hover:bg-[var(--surface-elevated)] transition-colors"
          >
            <svg className="w-6 h-6 text-[var(--text-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="text-center">
            <p className="text-sm text-[var(--text-tertiary)] mb-1">{t('room.code')}</p>
            <button
              onClick={handleCopyCode}
              className="text-3xl font-bold tracking-[0.3em] text-[var(--text-primary)] hover:text-primary-500 transition-colors"
            >
              {code}
            </button>
            <p className="text-xs text-[var(--text-tertiary)] mt-2">
              {copied ? t('room.copied') : 'Tap to copy'}
            </p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-sm font-medium text-[var(--text-tertiary)] uppercase tracking-wide mb-3">
            {t('room.players')} ({room.players.length})
          </h2>
          <PlayerList players={room.players} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="pt-4"
        >
          {isHost ? (
            <Button
              fullWidth
              size="lg"
              onClick={handleStartGame}
              disabled={isStarting || room.players.length < 3}
            >
              {t('room.startGame')}
            </Button>
          ) : (
            <Card className="text-center py-6">
              <p className="text-[var(--text-secondary)]">{t('room.waiting')}</p>
            </Card>
          )}
        </motion.div>
      </div>
    </Shell>
  )
}
