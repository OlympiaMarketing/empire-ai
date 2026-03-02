import type { LucideIcon } from "lucide-react"

type StatsCardProps = {
  title: string
  value: string | number
  icon: LucideIcon
  description?: string
}

export function StatsCard({ title, value, icon: Icon, description }: StatsCardProps) {
  return (
    <div className="rounded-lg border border-border bg-card/50 p-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{title}</p>
        <Icon className="w-5 h-5 text-muted-foreground" />
      </div>
      <p className="text-3xl font-bold mt-2 text-foreground">{value}</p>
      {description && (
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      )}
    </div>
  )
}
