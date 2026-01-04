import { Card } from './Card'

interface StatCardProps {
  label: string
  value: string | number
  icon?: string
}

export function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <Card padding="md" className="text-center">
      {icon && <span className="text-2xl mb-1 block">{icon}</span>}
      <div className="text-2xl font-bold text-[var(--text-primary)]">{value}</div>
      <div className="text-sm text-[var(--text-tertiary)]">{label}</div>
    </Card>
  )
}
