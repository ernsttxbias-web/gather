export interface Player {
  id: string
  name: string
  avatarId: number
  score: number
  isOnline: boolean
  isHost: boolean
}

export interface Room {
  code: string
  hostId: string
  status: 'lobby' | 'playing' | 'finished'
  players: Player[]
  currentRound: number
  totalRounds: number
}

export interface Round {
  id: string
  roundNumber: number
  pickerId: string
  tiktokUrl: string | null
  phase: 'picking' | 'watching' | 'guessing' | 'reveal' | 'done'
  phaseEndsAt: Date | null
  guessingStartedAt?: number // Timestamp when guessing phase started (for speed calculation)
}

export interface Guess {
  playerId: string
  guessedPlayerId: string
  isCorrect: boolean
  timestamp: number
}

export interface GameState {
  room: Room | null
  currentRound: Round | null
  guesses: Guess[]
  myPlayerId: string | null
  videos: TikTokVideo[]
  isLoadingVideos: boolean
}

export interface PlayerStats {
  playerId: string
  name: string
  avatarId: number
  totalScore: number
  correctGuesses: number
  totalGuesses: number
  timesAsPicker: number
  timesFooledOthers: number
  avgGuessTime: number
}

export interface Award {
  type: 'most_correct' | 'fastest' | 'trickiest'
  playerId: string
  value: number
}

export interface TikTokUser {
  open_id: string
  union_id: string
  avatar_large_url: string
  display_name: string
}

export interface TikTokVideo {
  id: string
  desc: string
  create_time: number
  video_cover: string
}

export interface TikTokAuth {
  access_token: string
  refresh_token: string
  expires_in: number
  scope: string
  open_id: string
  timestamp: number
}

export interface User {
  id: string
  email?: string
  username: string
  avatarId: number
  tiktokAuth?: TikTokAuth
  createdAt: number
}

export interface GuestUser {
  id: string
  username: string
  avatarId: number
  tiktokAuth?: TikTokAuth
  createdAt: number
}

export const AVATARS = [
  { id: 0, emoji: '🦊', name: 'Fox' },
  { id: 1, emoji: '🐼', name: 'Panda' },
  { id: 2, emoji: '🦁', name: 'Lion' },
  { id: 3, emoji: '🐨', name: 'Koala' },
  { id: 4, emoji: '🐸', name: 'Frog' },
  { id: 5, emoji: '🦄', name: 'Unicorn' },
  { id: 6, emoji: '🐙', name: 'Octopus' },
  { id: 7, emoji: '🦋', name: 'Butterfly' },
  { id: 8, emoji: '🐳', name: 'Whale' },
  { id: 9, emoji: '🦉', name: 'Owl' },
  { id: 10, emoji: '🐯', name: 'Tiger' },
  { id: 11, emoji: '🐰', name: 'Rabbit' },
  { id: 12, emoji: '🦈', name: 'Shark' },
  { id: 13, emoji: '🐲', name: 'Dragon' },
  { id: 14, emoji: '🦜', name: 'Parrot' },
  { id: 15, emoji: '🐺', name: 'Wolf' }
]
