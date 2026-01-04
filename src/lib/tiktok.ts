import { getTikTokAuth, setTikTokAuth } from './storage'
import type { TikTokAuth, TikTokUser, TikTokVideo } from '../types'

// TikTok API Configuration
const CLIENT_ID = import.meta.env.VITE_TIKTOK_CLIENT_ID || 'YOUR_CLIENT_ID'
const REDIRECT_URI = `${window.location.origin}/auth/tiktok/callback`
const SCOPES = ['user.info.basic', 'video.list']

export const getTikTokAuthUrl = (): string => {
  const state = Math.random().toString(36).substring(2, 15)
  sessionStorage.setItem('tiktok_oauth_state', state)
  
  const params = new URLSearchParams({
    client_key: CLIENT_ID,
    response_type: 'code',
    scope: SCOPES.join(','),
    redirect_uri: REDIRECT_URI,
    state
  })
  
  return `https://www.tiktok.com/v2/oauth/authorize/?${params.toString()}`
}

export const exchangeCodeForToken = async (code: string): Promise<TikTokAuth | null> => {
  try {
    // In production, this would be done on a backend server for security
    // For now, we'll use a backend API endpoint
    const response = await fetch('/api/tiktok/exchange-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    })
    
    if (!response.ok) throw new Error('Failed to exchange code')
    
    const data = await response.json()
    const auth: TikTokAuth = {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_in: data.expires_in,
      scope: data.scope,
      open_id: data.open_id,
      timestamp: Date.now()
    }
    
    setTikTokAuth(auth)
    return auth
  } catch (error) {
    console.error('Error exchanging code:', error)
    return null
  }
}

export const getCurrentUser = async (): Promise<TikTokUser | null> => {
  try {
    const auth = getTikTokAuth()
    if (!auth) return null
    
    const response = await fetch('https://open.tiktokapis.com/v2/user/info/', {
      headers: {
        'Authorization': `Bearer ${auth.access_token}`
      }
    })
    
    if (!response.ok) throw new Error('Failed to fetch user info')
    
    const data = await response.json()
    return data.data.user
  } catch (error) {
    console.error('Error fetching user:', error)
    return null
  }
}

export const getUserLikedVideos = async (): Promise<TikTokVideo[]> => {
  try {
    const auth = getTikTokAuth()
    if (!auth) return []
    
    const response = await fetch(
      `https://open.tiktokapis.com/v2/video/list/?fields=id,desc,create_time,video_cover`,
      {
        headers: {
          'Authorization': `Bearer ${auth.access_token}`,
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
          max_count: 100
        })
      }
    )
    
    if (!response.ok) throw new Error('Failed to fetch videos')
    
    const data = await response.json()
    return data.data?.videos || []
  } catch (error) {
    console.error('Error fetching videos:', error)
    return []
  }
}

export const isTokenExpired = (): boolean => {
  const auth = getTikTokAuth()
  if (!auth) return true
  
  const expiryTime = auth.timestamp + auth.expires_in * 1000
  return Date.now() > expiryTime
}

export const refreshToken = async (): Promise<TikTokAuth | null> => {
  try {
    const auth = getTikTokAuth()
    if (!auth) return null
    
    const response = await fetch('/api/tiktok/refresh-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: auth.refresh_token })
    })
    
    if (!response.ok) throw new Error('Failed to refresh token')
    
    const data = await response.json()
    const newAuth: TikTokAuth = {
      access_token: data.access_token,
      refresh_token: data.refresh_token || auth.refresh_token,
      expires_in: data.expires_in,
      scope: auth.scope,
      open_id: auth.open_id,
      timestamp: Date.now()
    }
    
    setTikTokAuth(newAuth)
    return newAuth
  } catch (error) {
    console.error('Error refreshing token:', error)
    return null
  }
}

export const isTikTokConnected = (): boolean => {
  const auth = getTikTokAuth()
  return !!auth && !isTokenExpired()
}
