import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

interface ConfettiPiece {
  id: number
  x: number
  delay: number
  duration: number
  color: string
}

export function Confetti({ active }: { active: boolean }) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (active) {
      const colors = ['#ff0080', '#ff8c00', '#40e0d0', '#7b68ee', '#ffd700', '#00ff7f']
      const newPieces: ConfettiPiece[] = []
      for (let i = 0; i < 100; i++) {
        newPieces.push({
          id: i,
          x: Math.random() * 100,
          delay: Math.random() * 0.5,
          duration: 2 + Math.random() * 2,
          color: colors[Math.floor(Math.random() * colors.length)]
        })
      }
      setPieces(newPieces)
      const timer = setTimeout(() => setPieces([]), 4000)
      return () => clearTimeout(timer)
    }
  }, [active])

  if (!mounted || pieces.length === 0) return null

  return createPortal(
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute w-3 h-3 rounded-sm animate-confetti"
          style={{
            left: `${piece.x}%`,
            top: '-10px',
            backgroundColor: piece.color,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`
          }}
        />
      ))}
      <style>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-confetti {
          animation: confetti linear forwards;
        }
      `}</style>
    </div>,
    document.body
  )
}
