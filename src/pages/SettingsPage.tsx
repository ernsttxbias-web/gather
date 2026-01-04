import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Shell } from '../components/layout/Shell'
import { Input } from '../components/ui/Input'
import { Card } from '../components/ui/Card'
import { Avatar, AvatarPicker } from '../components/ui/Avatar'
import { Button } from '../components/ui/Button'
import { SettingsRow, Toggle, Slider, SegmentedControl } from '../components/ui/Settings'
import { Modal } from '../components/ui/Modal'
import { useTheme } from '../hooks/useTheme'
import { useSoundStore } from '../hooks/useSound'
import { getProfile, setProfile, getSettings, setSettings, clearTikTokAuth, type Profile } from '../lib/storage'
import { isTikTokConnected, getTikTokAuthUrl } from '../lib/tiktok'
import i18n from '../lib/i18n'

export function SettingsPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { theme, setTheme } = useTheme()
  const { volume, muted, setVolume, setMuted } = useSoundStore()
  
  const [profile, setProfileState] = useState<Profile>(getProfile())
  const [showAvatarPicker, setShowAvatarPicker] = useState(false)
  const [language, setLanguage] = useState<'en' | 'de'>(getSettings().language)
  const [isTikTokConnectedState, setIsTikTokConnectedState] = useState(isTikTokConnected())

  const handleNameChange = (name: string) => {
    const updated = setProfile({ name })
    setProfileState(updated)
  }

  const handleAvatarChange = (avatarId: number) => {
    const updated = setProfile({ avatarId })
    setProfileState(updated)
    setShowAvatarPicker(false)
  }

  const handleLanguageChange = (lang: 'en' | 'de') => {
    setLanguage(lang)
    setSettings({ language: lang })
    i18n.changeLanguage(lang)
  }

  const handleTikTokConnect = () => {
    if (isTikTokConnectedState) {
      clearTikTokAuth()
      setIsTikTokConnectedState(false)
    } else {
      window.location.href = getTikTokAuthUrl()
    }
  }

  return (
    <Shell
      topbarContent={
        <div className="flex items-center justify-between w-full">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-full hover:bg-[var(--surface-elevated)] transition-colors"
          >
            <svg className="w-6 h-6 text-[var(--text-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-lg font-semibold">{t('settings.title')}</span>
          <div className="w-10" />
        </div>
      }
    >
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-sm font-medium text-[var(--text-tertiary)] uppercase tracking-wide mb-3">
            {t('settings.profile')}
          </h2>
          <Card>
            <div className="flex items-center gap-4 mb-4">
              <button onClick={() => setShowAvatarPicker(true)}>
                <Avatar avatarId={profile.avatarId} size="xl" />
              </button>
              <div className="flex-1">
                <Input
                  placeholder={t('settings.name')}
                  value={profile.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  maxLength={20}
                />
              </div>
            </div>
            <button
              onClick={() => setShowAvatarPicker(true)}
              className="text-sm text-primary-500 font-medium"
            >
              {t('settings.avatar')}
            </button>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-sm font-medium text-[var(--text-tertiary)] uppercase tracking-wide mb-3">
            {t('settings.sound')}
          </h2>
          <Card>
            <SettingsRow label={t('settings.masterVolume')}>
              <Slider value={volume} onChange={setVolume} />
            </SettingsRow>
            <SettingsRow label={t('settings.mute')}>
              <Toggle checked={muted} onChange={setMuted} />
            </SettingsRow>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-sm font-medium text-[var(--text-tertiary)] uppercase tracking-wide mb-3">
            {t('settings.theme')}
          </h2>
          <Card>
            <SegmentedControl
              options={[
                { value: 'light', label: t('settings.light') },
                { value: 'dark', label: t('settings.dark') },
                { value: 'system', label: t('settings.system') }
              ]}
              value={theme}
              onChange={setTheme}
            />
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-sm font-medium text-[var(--text-tertiary)] uppercase tracking-wide mb-3">
            {t('settings.language')}
          </h2>
          <Card>
            <SegmentedControl
              options={[
                { value: 'en', label: 'English' },
                { value: 'de', label: 'Deutsch' }
              ]}
              value={language}
              onChange={handleLanguageChange}
            />
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-sm font-medium text-[var(--text-tertiary)] uppercase tracking-wide mb-3">
            {t('settings.tiktok')}
          </h2>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--text-primary)]">
                  {isTikTokConnectedState ? t('settings.tiktokConnected') : t('settings.tiktokNotConnected')}
                </p>
              </div>
              <Button
                variant={isTikTokConnectedState ? 'secondary' : 'primary'}
                onClick={handleTikTokConnect}
              >
                {isTikTokConnectedState ? t('settings.disconnectTikTok') : t('settings.connectTikTok')}
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>

      <Modal
        isOpen={showAvatarPicker}
        onClose={() => setShowAvatarPicker(false)}
        title={t('settings.avatar')}
      >
        <AvatarPicker
          selectedId={profile.avatarId}
          onSelect={handleAvatarChange}
        />
      </Modal>
    </Shell>
  )
}
