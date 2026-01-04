interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular'
  width?: string | number
  height?: string | number
}

export function Skeleton({ className = '', variant = 'rectangular', width, height }: SkeletonProps) {
  const variants = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-xl'
  }

  return (
    <div
      className={`animate-pulse bg-[var(--border)] ${variants[variant]} ${className}`}
      style={{ width, height }}
    />
  )
}

export function PlayerSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)]">
      <Skeleton variant="circular" width={48} height={48} />
      <div className="flex-1">
        <Skeleton variant="text" width="60%" height={16} className="mb-1" />
        <Skeleton variant="text" width="30%" height={12} />
      </div>
    </div>
  )
}
