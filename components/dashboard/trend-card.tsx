import { Badge } from "@/components/ui/badge"
import { TrendingUp } from "lucide-react"
import type { Trend } from "@/lib/supabase/types"

type TrendCardProps = {
  trend: Trend
}

export function TrendCard({ trend }: TrendCardProps) {
  return (
    <div className="rounded-lg border border-border bg-card/50 p-5 hover:border-cyan/30 hover:bg-card transition-all">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold truncate">{trend.keyword}</h3>
          <div className="flex items-center gap-2 mt-2">
            {trend.category && (
              <Badge variant="secondary" className="text-xs">
                {trend.category}
              </Badge>
            )}
            <Badge
              variant="outline"
              className="text-xs"
            >
              {trend.source === "google_trends" ? "Google" : "News"}
            </Badge>
          </div>
        </div>
        {trend.search_volume && (
          <div className="flex items-center gap-1 text-cyan text-sm font-medium ml-2">
            <TrendingUp className="w-4 h-4" />
            <span>{trend.search_volume.toLocaleString()}</span>
          </div>
        )}
      </div>
      <p className="text-xs text-muted-foreground mt-3">
        {new Date(trend.trend_date).toLocaleDateString()}
      </p>
    </div>
  )
}
