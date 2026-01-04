import { createContext, useContext, useReducer, type ReactNode, useCallback, useRef } from 'react'
import { supabase, generateRoomCode } from '../lib/supabase'
import { getProfile, setSession, clearSession, getCachedRoom, setCachedRoom, clearCachedRoom } from '../lib/storage'
import { fetchLikedVideos } from '../lib/videoService'
import type { Room, Round, Player, GameState, Guess } from '../types'
import type { RealtimeChannel } from '@supabase/supabase-js'

type GameAction =
  | { type: 'SET_ROOM'; room: Room | null }
  | { type: 'SET_ROUND'; round: Round | null }
  | { type: 'SET_PLAYER_ID'; playerId: string }
  | { type: 'UPDATE_PLAYERS'; players: Player[] }
  | { type: 'ADD_PLAYER'; player: Player }
  | { type: 'REMOVE_PLAYER'; playerId: string }
  | { type: 'ADD_GUESS'; guess: Guess }
  | { type: 'SET_GUESSES'; guesses: Guess[] }
  | { type: 'UPDATE_PHASE'; phase: Round['phase']; phaseEndsAt: Date | null; guessingStartedAt?: number }
  | { type: 'INCREMENT_SCORE'; playerId: string; points: number }
  | { type: 'SET_VIDEOS'; videos: any[] }
  | { type: 'SET_LOADING_VIDEOS'; loading: boolean }
  | { type: 'RESET' }

function gameReducer(state: GameState, action: GameAction): GameState {
  const newState = (() => {
    switch (action.type) {
      case 'SET_ROOM':
        return { ...state, room: action.room }
      case 'SET_ROUND':
        return { ...state, currentRound: action.round, guesses: [] }
      case 'SET_PLAYER_ID':
        return { ...state, myPlayerId: action.playerId }
      case 'UPDATE_PLAYERS':
        if (!state.room) return state
        return { ...state, room: { ...state.room, players: action.players } }
      case 'ADD_PLAYER':
        if (!state.room) return state
        const exists = state.room.players.some(p => p.id === action.player.id)
        if (exists) return state
        return { ...state, room: { ...state.room, players: [...state.room.players, action.player] } }
      case 'REMOVE_PLAYER':
        if (!state.room) return state
        return { ...state, room: { ...state.room, players: state.room.players.filter(p => p.id !== action.playerId) } }
      case 'ADD_GUESS':
        return { ...state, guesses: [...state.guesses, action.guess] }
      case 'SET_GUESSES':
        return { ...state, guesses: action.guesses }
      case 'UPDATE_PHASE':
        if (!state.currentRound) return state
        return {
          ...state,
          currentRound: {
            ...state.currentRound,
            phase: action.phase,
            phaseEndsAt: action.phaseEndsAt,
            guessingStartedAt: action.guessingStartedAt || state.currentRound.guessingStartedAt
          }
        }
      case 'INCREMENT_SCORE':
        if (!state.room) return state
        return {
          ...state,
          room: {
            ...state.room,
            players: state.room.players.map((p) =>
              p.id === action.playerId ? { ...p, score: p.score + action.points } : p
            )
          }
        }
      case 'SET_VIDEOS':
        return { ...state, videos: action.videos }
      case 'SET_LOADING_VIDEOS':
        return { ...state, isLoadingVideos: action.loading }
      case 'RESET':
        clearCachedRoom()
        return initialState
      default:
        return state
    }
  })()
  
  // Cache room state whenever it changes
  if (newState.room && newState.room !== state.room) {
    setCachedRoom(newState.room)
  }
  
  return newState
}

const initialState: GameState = {
  room: null,
  currentRound: null,
  guesses: [],
  myPlayerId: null,
  videos: [],
  isLoadingVideos: false
}

interface GameContextValue extends GameState {
  createRoom: () => Promise<string>
  joinRoom: (code: string) => Promise<boolean>
  leaveRoom: () => Promise<void>
  startGame: (totalRounds?: number) => Promise<void>
  submitTikTokLink: (url: string) => Promise<void>
  submitGuess: (guessedPlayerId: string) => Promise<void>
  transferHost: (playerId: string) => Promise<void>
  loadVideos: () => Promise<void>
  isHost: boolean
  isPicker: boolean
  hasGuessed: boolean
}

const GameContext = createContext<GameContextValue | null>(null)

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState)
  const channelRef = useRef<RealtimeChannel | null>(null)
  const isSubscribedRef = useRef(false)

  const waitForSubscription = (): Promise<void> => {
    return new Promise((resolve) => {
      if (isSubscribedRef.current) {
        resolve()
        return
      }
      const check = setInterval(() => {
        if (isSubscribedRef.current) {
          clearInterval(check)
          resolve()
        }
      }, 50)
      setTimeout(() => {
        clearInterval(check)
        resolve()
      }, 3000)
    })
  }

  const broadcast = async (event: string, payload: Record<string, unknown>) => {
    const channel = channelRef.current
    if (!channel) return
    
    await waitForSubscription()
    
    await channel.send({
      type: 'broadcast',
      event,
      payload
    })
  }

  const subscribeToRoom = useCallback((roomCode: string) => {
    if (channelRef.current) {
      channelRef.current.unsubscribe()
    }
    isSubscribedRef.current = false

    const channel = supabase.channel(`room:${roomCode}`, {
      config: { 
        broadcast: { self: true },
        presence: { key: state.myPlayerId || '' } 
      }
    })

    channel
      .on('presence', { event: 'sync' }, () => {
        const presenceState = channel.presenceState()
        const onlineIds = new Set(Object.keys(presenceState))
        if (state.room) {
          dispatch({
            type: 'UPDATE_PLAYERS',
            players: state.room.players.map((p) => ({
              ...p,
              isOnline: onlineIds.has(p.id)
            }))
          })
        }
      })
      .on('broadcast', { event: 'player_joined' }, ({ payload }) => {
        const newPlayer: Player = {
          id: payload.id,
          name: payload.name,
          avatarId: payload.avatarId,
          score: 0,
          isOnline: true,
          isHost: false
        }
        dispatch({
          type: 'ADD_PLAYER',
          player: newPlayer
        })
      })
      .on('broadcast', { event: 'player_left' }, ({ payload }) => {
        dispatch({
          type: 'REMOVE_PLAYER',
          playerId: payload.id
        })
      })
      .on('broadcast', { event: 'game_started' }, ({ payload }) => {
        if (state.room) {
          dispatch({
            type: 'SET_ROOM',
            room: { ...state.room, status: 'playing', totalRounds: payload.totalRounds }
          })
        }
      })
      .on('broadcast', { event: 'new_round' }, ({ payload }) => {
        dispatch({
          type: 'SET_ROUND',
          round: {
            id: payload.id,
            roundNumber: payload.roundNumber,
            pickerId: payload.pickerId,
            tiktokUrl: null,
            phase: 'picking',
            phaseEndsAt: null
          }
        })
      })
      .on('broadcast', { event: 'link_submitted' }, ({ payload }) => {
        dispatch({
          type: 'UPDATE_PHASE',
          phase: 'watching',
          phaseEndsAt: new Date(payload.phaseEndsAt)
        })
        if (state.currentRound) {
          dispatch({
            type: 'SET_ROUND',
            round: { ...state.currentRound, tiktokUrl: payload.url, phase: 'watching', phaseEndsAt: new Date(payload.phaseEndsAt) }
          })
        }
      })
      .on('broadcast', { event: 'phase_change' }, ({ payload }) => {
        dispatch({
          type: 'UPDATE_PHASE',
          phase: payload.phase,
          phaseEndsAt: payload.phaseEndsAt ? new Date(payload.phaseEndsAt) : null,
          guessingStartedAt: payload.phase === 'guessing' ? Date.now() : undefined
        })
      })
      .on('broadcast', { event: 'guess_made' }, ({ payload }) => {
        dispatch({ type: 'ADD_GUESS', guess: payload })
      })
      .on('broadcast', { event: 'reveal' }, ({ payload }) => {
        dispatch({ type: 'SET_GUESSES', guesses: payload.guesses })
        payload.scores.forEach((s: { playerId: string; points: number }) => {
          dispatch({ type: 'INCREMENT_SCORE', ...s })
        })
      })
      .on('broadcast', { event: 'game_ended' }, () => {
        if (state.room) {
          dispatch({ type: 'SET_ROOM', room: { ...state.room, status: 'finished' } })
        }
      })
      .on('broadcast', { event: 'host_changed' }, ({ payload }) => {
        if (state.room) {
          dispatch({
            type: 'UPDATE_PLAYERS',
            players: state.room.players.map((p) => ({
              ...p,
              isHost: p.id === payload.newHostId
            }))
          })
          dispatch({
            type: 'SET_ROOM',
            room: { ...state.room, hostId: payload.newHostId }
          })
        }
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          isSubscribedRef.current = true
          if (state.myPlayerId) {
            await channel.track({ id: state.myPlayerId })
          }
        }
      })

    channelRef.current = channel
  }, [])

  const createRoom = async (): Promise<string> => {
    const profile = getProfile()
    const code = generateRoomCode()
    const playerId = profile.id
    const reconnectToken = Math.random().toString(36).substring(2)

    const room: Room = {
      code,
      hostId: playerId,
      status: 'lobby',
      players: [
        {
          id: playerId,
          name: profile.name || 'Player',
          avatarId: profile.avatarId,
          score: 0,
          isOnline: true,
          isHost: true
        }
      ],
      currentRound: 0,
      totalRounds: 5
    }

    dispatch({ type: 'SET_PLAYER_ID', playerId })
    // Cache room BEFORE subscribing so joiners can find it
    setCachedRoom(room)
    dispatch({ type: 'SET_ROOM', room })
    setSession({ roomCode: code, reconnectToken })
    subscribeToRoom(code)

    return code
  }

  const joinRoom = async (code: string): Promise<boolean> => {
    const profile = getProfile()
    const playerId = profile.id
    const reconnectToken = Math.random().toString(36).substring(2)

    dispatch({ type: 'SET_PLAYER_ID', playerId })
    setSession({ roomCode: code, reconnectToken })
    
    // Load cached room state immediately - THIS IS KEY
    const cachedRoom = getCachedRoom()
    if (cachedRoom && cachedRoom.code === code) {
      dispatch({ type: 'SET_ROOM', room: cachedRoom })
    } else {
      // Placeholder so RoomPage doesn't show loading
      const placeholderRoom: Room = {
        code,
        hostId: 'loading',
        status: 'lobby',
        players: [{
          id: playerId,
          name: profile.name || 'Player',
          avatarId: profile.avatarId,
          score: 0,
          isOnline: true,
          isHost: false
        }],
        currentRound: 0,
        totalRounds: 5
      }
      dispatch({ type: 'SET_ROOM', room: placeholderRoom })
    }
    
    subscribeToRoom(code)

    // Wait for subscription to be ready
    await waitForSubscription()

    // Send join notification
    await broadcast('player_joined', {
      id: playerId,
      name: profile.name || 'Player',
      avatarId: profile.avatarId
    })

    return true
  }

  const leaveRoom = async () => {
    if (state.myPlayerId) {
      await broadcast('player_left', { id: state.myPlayerId })
    }
    if (channelRef.current) {
      channelRef.current.unsubscribe()
    }
    isSubscribedRef.current = false
    clearSession()
    dispatch({ type: 'RESET' })
  }

  const startGame = async (totalRounds = 5) => {
    if (state.room) {
      await broadcast('game_started', { totalRounds })
      
      const firstPicker = state.room.players[0]
      await broadcast('new_round', {
        id: Math.random().toString(36).substring(2),
        roundNumber: 1,
        pickerId: firstPicker.id
      })
    }
  }

  const submitTikTokLink = async (url: string) => {
    const phaseEndsAt = new Date(Date.now() + 30000)
    await broadcast('link_submitted', { 
      url, 
      phaseEndsAt: phaseEndsAt.toISOString() 
    })
  }

  const submitGuess = async (guessedPlayerId: string) => {
    if (state.myPlayerId && state.currentRound) {
      const isCorrect = guessedPlayerId === state.currentRound.pickerId
      await broadcast('guess_made', {
        playerId: state.myPlayerId,
        guessedPlayerId,
        isCorrect,
        timestamp: Date.now()
      })
    }
  }

  const transferHost = async (playerId: string) => {
    await broadcast('host_changed', { newHostId: playerId })
  }

  const loadVideos = async () => {
    dispatch({ type: 'SET_LOADING_VIDEOS', loading: true })
    try {
      const videos = await fetchLikedVideos()
      dispatch({ type: 'SET_VIDEOS', videos })
    } catch (error) {
      console.error('Failed to load videos:', error)
    } finally {
      dispatch({ type: 'SET_LOADING_VIDEOS', loading: false })
    }
  }

  const isHost = state.room?.hostId === state.myPlayerId
  const isPicker = state.currentRound?.pickerId === state.myPlayerId
  const hasGuessed = state.guesses.some((g) => g.playerId === state.myPlayerId)

  return (
    <GameContext.Provider
      value={{
        ...state,
        createRoom,
        joinRoom,
        leaveRoom,
        startGame,
        submitTikTokLink,
        submitGuess,
        transferHost,
        loadVideos,
        isHost,
        isPicker,
        hasGuessed
      }}
    >
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error('useGame must be used within a GameProvider')
  }
  return context
}
