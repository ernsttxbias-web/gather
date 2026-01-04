import { useEffect } from 'react'
import { useGame } from '../context/GameContext'

export function useGameVideos() {
  const context = useGame()

  useEffect(() => {
    // Auto-load videos on mount if not already loaded
    if (context.videos.length === 0 && !context.isLoadingVideos) {
      context.loadVideos()
    }
  }, [])

  return {
    videos: context.videos,
    isLoadingVideos: context.isLoadingVideos,
    loadVideos: context.loadVideos
  }
}
