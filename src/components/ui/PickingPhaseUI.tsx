import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useGame } from '../../context/GameContext'
import { Input } from './Input'
import { Button } from './Button'

export function PickingPhaseUI() {
  const { t } = useTranslation()
  const { isPicker, submitTikTokLink } = useGame()
  const [tiktokUrl, setTiktokUrl] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (!isPicker) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96">
        <p className="text-lg font-semibold text-[var(--text-primary)] mb-2">
          {t('game.yourTurn')}
        </p>
        <p className="text-sm text-[var(--text-tertiary)]">Waiting for video submission...</p>
      </div>
    )
  }

  const validateTiktokUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url)
      return (
        urlObj.hostname.includes('tiktok.com') || 
        urlObj.hostname.includes('vm.tiktok.com') ||
        urlObj.hostname.includes('vt.tiktok.com')
      )
    } catch {
      return false
    }
  }

  const handleSubmit = async () => {
    setError('')

    if (!tiktokUrl.trim()) {
      setError('Please enter a TikTok URL')
      return
    }

    if (!validateTiktokUrl(tiktokUrl)) {
      setError('Please enter a valid TikTok URL')
      return
    }

    setIsSubmitting(true)
    try {
      await submitTikTokLink(tiktokUrl)
      setTiktokUrl('')
    } catch (err) {
      setError('Failed to submit video')
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-medium text-[var(--text-tertiary)] uppercase tracking-wide mb-3">
          {t('game.enterLink')}
        </p>
        <Input
          placeholder="https://www.tiktok.com/@user/video/123456"
          value={tiktokUrl}
          onChange={(e) => setTiktokUrl(e.target.value)}
          disabled={isSubmitting}
        />
        {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
      </div>

      <Button
        onClick={handleSubmit}
        disabled={isSubmitting || !tiktokUrl.trim()}
        fullWidth
        variant="primary"
      >
        {isSubmitting ? 'Submitting...' : t('game.submit')}
      </Button>
    </div>
  )
}
