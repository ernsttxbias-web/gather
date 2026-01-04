import { Card } from './Card'

interface TikTokCardProps {
  url: string
}

export function TikTokCard({ url }: TikTokCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center gap-3 p-4">
        <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
          <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-[var(--text-primary)] truncate">TikTok Video</p>
          <p className="text-sm text-[var(--text-tertiary)] truncate">{url}</p>
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors"
        >
          Open
        </a>
      </div>
    </Card>
  )
}

export function validateTikTokUrl(url: string): boolean {
  const patterns = [
    /^https?:\/\/(www\.)?tiktok\.com\/@[\w.-]+\/video\/\d+/,
    /^https?:\/\/vm\.tiktok\.com\/\w+/,
    /^https?:\/\/(www\.)?tiktok\.com\/t\/\w+/
  ]
  return patterns.some((pattern) => pattern.test(url))
}
