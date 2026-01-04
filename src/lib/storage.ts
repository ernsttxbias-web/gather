export interface Profile {
  id: string
  name: string
  avatarId: number
}

export interface Settings {
  theme: 'light' | 'dark' | 'system'
  language: 'en' | 'de'
  volume: number
  muted: boolean
}

export interface Session {
  roomCode: string | null
  reconnectToken: string | null
}

const STORAGE_KEYS = {
  profile: 'partyhub_profile',
  settings: 'partyhub_settings',
  session: 'partyhub_session',
  cachedRoom: 'partyhub_cached_room',
  tiktokAuth: 'partyhub_tiktok_auth'
}

const generateId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

const defaultProfile: Profile = {
  id: generateId(),
  name: '',
  avatarId: 0
}

const defaultSettings: Settings = {
  theme: 'system',
  language: 'en',
  volume: 0.7,
  muted: false
}

const defaultSession: Session = {
  roomCode: null,
  reconnectToken: null
}

export const getProfile = (): Profile => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.profile)
    if (stored) {
      return { ...defaultProfile, ...JSON.parse(stored) }
    }
  } catch {}
  return defaultProfile
}

export const setProfile = (profile: Partial<Profile>): Profile => {
  const current = getProfile()
  const updated = { ...current, ...profile }
  localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(updated))
  return updated
}

export const getSettings = (): Settings => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.settings)
    if (stored) {
      return { ...defaultSettings, ...JSON.parse(stored) }
    }
  } catch {}
  return defaultSettings
}

export const setSettings = (settings: Partial<Settings>): Settings => {
  const current = getSettings()
  const updated = { ...current, ...settings }
  localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(updated))
  return updated
}

export const getSession = (): Session => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.session)
    if (stored) {
      return { ...defaultSession, ...JSON.parse(stored) }
    }
  } catch {}
  return defaultSession
}

export const setSession = (session: Partial<Session>): Session => {
  const current = getSession()
  const updated = { ...current, ...session }
  localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(updated))
  return updated
}

export const clearSession = (): void => {
  localStorage.removeItem(STORAGE_KEYS.session)
}

export const getCachedRoom = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.cachedRoom)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch {}
  return null
}

export const setCachedRoom = (room: any): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.cachedRoom, JSON.stringify(room))
  } catch {}
}

export const clearCachedRoom = (): void => {
  localStorage.removeItem(STORAGE_KEYS.cachedRoom)
}

export interface TikTokAuth {
  access_token: string
  refresh_token: string
  expires_in: number
  scope: string
  open_id: string
  timestamp: number
}

export const getTikTokAuth = (): TikTokAuth | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.tiktokAuth)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch {}
  return null
}

export const setTikTokAuth = (auth: TikTokAuth): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.tiktokAuth, JSON.stringify(auth))
  } catch {}
}

export const clearTikTokAuth = (): void => {
  localStorage.removeItem(STORAGE_KEYS.tiktokAuth)
}
