import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Shell } from '../components/layout/Shell'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Modal } from '../components/ui/Modal'
import { useGame } from '../context/GameContext'
import { getProfile } from '../lib/storage'
import { toast } from '../components/ui/Toast'

export function LandingPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { createRoom, joinRoom } = useGame()
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [roomCode, setRoomCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const profile = getProfile()

  const handleCreateRoom = async () => {
    if (!profile.name) {
      toast(t('settings.name') + ' required', 'error')
      navigate('/settings')
      return
    }
    setIsLoading(true)
    try {
      const code = await createRoom()
      navigate(`/room/${code}`)
    } catch {
      toast(t('common.error'), 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleJoinRoom = async () => {
    if (!profile.name) {
      toast(t('settings.name') + ' required', 'error')
      navigate('/settings')
      return
    }
    if (roomCode.length !== 6) {
      toast(t('landing.invalidCode'), 'error')
      return
    }
    setIsLoading(true)
    try {
      const success = await joinRoom(roomCode.toUpperCase())
      if (success) {
        navigate(`/room/${roomCode.toUpperCase()}`)
      } else {
        toast(t('landing.invalidCode'), 'error')
      }
    } catch {
      toast(t('common.error'), 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Shell
      topbarContent={
        <div className="flex items-center justify-between w-full">
          <span className="text-lg font-semibold">{t('app.name')}</span>
          <button
            onClick={() => navigate('/settings')}
            className="p-2 rounded-full hover:bg-[var(--surface-elevated)] transition-colors"
          >
            <svg className="w-6 h-6 text-[var(--text-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      }
    >
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-2">
            {t('app.name')}
          </h1>
          <p className="text-xl text-primary-500 font-medium mb-4">
            {t('app.tagline')}
          </p>
          <p className="text-[var(--text-secondary)]">
            {t('app.description')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full max-w-xs space-y-4"
        >
          <Button
            fullWidth
            size="lg"
            onClick={handleCreateRoom}
            disabled={isLoading}
          >
            {t('landing.createRoom')}
          </Button>
          <Button
            fullWidth
            size="lg"
            variant="secondary"
            onClick={() => setShowJoinModal(true)}
            disabled={isLoading}
          >
            {t('landing.joinRoom')}
          </Button>
        </motion.div>
      </div>

      <Modal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        title={t('landing.joinRoom')}
      >
        <div className="space-y-4">
          <Input
            placeholder={t('landing.enterCode')}
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
            maxLength={6}
            className="text-center text-2xl tracking-widest uppercase"
          />
          <Button
            fullWidth
            onClick={handleJoinRoom}
            disabled={isLoading || roomCode.length !== 6}
          >
            {t('landing.join')}
          </Button>
        </div>
      </Modal>
    </Shell>
  )
}
