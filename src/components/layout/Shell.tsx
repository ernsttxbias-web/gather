import type { ReactNode } from 'react'

interface ShellProps {
  children: ReactNode
  showTopbar?: boolean
  topbarContent?: ReactNode
}

export function Shell({ children, showTopbar = true, topbarContent }: ShellProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {showTopbar && (
        <header className="sticky top-0 z-40 glass border-b hairline border-[var(--border)]">
          <div className="max-w-xl mx-auto px-4 h-14 flex items-center justify-between">
            {topbarContent || (
              <span className="text-lg font-semibold text-[var(--text-primary)]">Gather</span>
            )}
          </div>
        </header>
      )}
      <main className="flex-1 max-w-xl mx-auto w-full px-4 py-6">
        {children}
      </main>
    </div>
  )
}
