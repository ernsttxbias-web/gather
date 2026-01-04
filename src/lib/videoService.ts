import { getUserLikedVideos, isTokenExpired, refreshToken } from './tiktok'
import { getTikTokAuth } from './storage'
import type { TikTokVideo } from '../types'

const VIDEOS_CACHE_KEY = 'partyhub_cached_videos'
const VIDEOS_CACHE_TIMESTAMP_KEY = 'partyhub_cached_videos_timestamp'
const CACHE_DURATION = 1000 * 60 * 60 // 1 hour

export const getCachedVideos = (): TikTokVideo[] => {
  try {
    const cached = localStorage.getItem(VIDEOS_CACHE_KEY)
    if (!cached) return []
    
    const timestamp = localStorage.getItem(VIDEOS_CACHE_TIMESTAMP_KEY)
    if (timestamp && Date.now() - parseInt(timestamp) > CACHE_DURATION) {
      // Cache expired, clear it
      localStorage.removeItem(VIDEOS_CACHE_KEY)
      localStorage.removeItem(VIDEOS_CACHE_TIMESTAMP_KEY)
      return []
    }
    
    return JSON.parse(cached)
  } catch {
    return []
  }
}

export const setCachedVideos = (videos: TikTokVideo[]): void => {
  try {
    localStorage.setItem(VIDEOS_CACHE_KEY, JSON.stringify(videos))
    localStorage.setItem(VIDEOS_CACHE_TIMESTAMP_KEY, Date.now().toString())
  } catch {}
}

export const clearCachedVideos = (): void => {
  localStorage.removeItem(VIDEOS_CACHE_KEY)
  localStorage.removeItem(VIDEOS_CACHE_TIMESTAMP_KEY)
}

export const fetchLikedVideos = async (): Promise<TikTokVideo[]> => {
  try {
    const auth = getTikTokAuth()
    if (!auth) return []

    // Check if token is expired and refresh if needed
    if (isTokenExpired()) {
      const refreshed = await refreshToken()
      if (!refreshed) {
        console.warn('Token refresh failed')
        return getCachedVideos() // Fall back to cache
      }
    }

    // Fetch videos from TikTok API
    const videos = await getUserLikedVideos()
    
    if (videos && videos.length > 0) {
      setCachedVideos(videos)
      return videos
    }

    // If API returns empty, use cache
    return getCachedVideos()
  } catch (error) {
    console.error('Error fetching liked videos:', error)
    // Fall back to cache on error
    return getCachedVideos()
  }
}
