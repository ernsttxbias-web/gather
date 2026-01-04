import { useState } from 'react'
import { useGameVideos } from '../../hooks/useGameVideos'

export function VideoCarousel() {
  const { videos, isLoadingVideos } = useGameVideos()
  const [currentIndex, setCurrentIndex] = useState(0)

  if (isLoadingVideos) {
    return (
      <div className="flex items-center justify-center h-96 bg-[var(--surface)] rounded-lg">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (!videos || videos.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 bg-[var(--surface)] rounded-lg">
        <p className="text-[var(--text-tertiary)]">No videos available</p>
      </div>
    )
  }

  const video = videos[currentIndex]

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? videos.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === videos.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="space-y-4">
      <div className="relative h-96 bg-[var(--surface)] rounded-lg overflow-hidden">
        {video.video_cover && (
          <img
            src={video.video_cover}
            alt={video.desc}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-4">
          <p className="text-white text-sm line-clamp-2">{video.desc || 'Untitled video'}</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={handlePrevious}
          className="p-2 rounded-full hover:bg-[var(--surface-elevated)] transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="flex gap-1">
          {videos.map((_: any, idx: number) => (
            <div
              key={idx}
              className={`h-1 rounded-full transition-all ${
                idx === currentIndex ? 'w-8 bg-primary-500' : 'w-2 bg-[var(--surface-elevated)]'
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="p-2 rounded-full hover:bg-[var(--surface-elevated)] transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <p className="text-xs text-[var(--text-tertiary)] text-center">
        Video {currentIndex + 1} of {videos.length}
      </p>
    </div>
  )
}
