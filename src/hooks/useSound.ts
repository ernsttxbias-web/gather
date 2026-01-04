import { useCallback } from 'react'
import { Howl, Howler } from 'howler'
import { getSettings, setSettings } from '../lib/storage'
import { create } from 'zustand'

interface SoundState {
  volume: number
  muted: boolean
  setVolume: (volume: number) => void
  setMuted: (muted: boolean) => void
}

export const useSoundStore = create<SoundState>((set) => {
  const settings = getSettings()
  return {
    volume: settings.volume,
    muted: settings.muted,
    setVolume: (volume) => {
      set({ volume })
      setSettings({ volume })
      Howler.volume(volume)
    },
    setMuted: (muted) => {
      set({ muted })
      setSettings({ muted })
      Howler.mute(muted)
    }
  }
})

const sounds: Record<string, Howl | null> = {}
const loadedSounds = new Set<string>()
const failedSounds = new Set<string>()

const SOUND_FILES = {
  click: '/sounds/click.mp3',
  success: '/sounds/success.mp3',
  error: '/sounds/error.mp3',
  countdown: '/sounds/countdown.mp3',
  reveal: '/sounds/reveal.mp3',
  correct: '/sounds/correct.mp3',
  wrong: '/sounds/wrong.mp3',
  join: '/sounds/join.mp3',
  leave: '/sounds/leave.mp3',
  start: '/sounds/start.mp3',
  win: '/sounds/win.mp3',
  confetti: '/sounds/confetti.mp3'
}

export type SoundName = keyof typeof SOUND_FILES

function loadSound(name: SoundName): Howl | null {
  if (failedSounds.has(name)) return null
  if (sounds[name]) return sounds[name]

  try {
    const sound = new Howl({
      src: [SOUND_FILES[name]],
      preload: true,
      volume: getSettings().volume,
      onloaderror: () => {
        failedSounds.add(name)
        sounds[name] = null
      }
    })
    sounds[name] = sound
    loadedSounds.add(name)
    return sound
  } catch {
    failedSounds.add(name)
    return null
  }
}

export function preloadSounds() {
  Object.keys(SOUND_FILES).forEach((key) => {
    loadSound(key as SoundName)
  })
}

export function useSound() {
  const { volume, muted } = useSoundStore()
  
  const play = useCallback((name: SoundName) => {
    if (muted) return
    
    try {
      const sound = loadSound(name)
      if (sound) {
        sound.volume(volume)
        sound.play()
      }
    } catch {
      // Silently fail if sound cannot be played
    }
  }, [volume, muted])

  return { play }
}
