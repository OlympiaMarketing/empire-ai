"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, Bookmark, Eye, ArrowRight } from "lucide-react"
import type { BusinessIdea } from "@/lib/supabase/types"
import { cn } from "@/lib/utils"

type IdeaCardProps = {
  idea: BusinessIdea
  matchScore?: number
  onLike?: () => void
  onSave?: () => void
  onSelect?: () => void
  isLiked?: boolean
  isSaved?: boolean
}

const difficultyColors: Record<string, string> = {
  easy: "bg-green-500/10 text-green-400 border-green-500/20",
  medium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  hard: "bg-red-500/10 text-red-400 border-red-500/20",
}

export function IdeaCard({
  idea,
  matchScore,
  onLike,
  onSave,
  onSelect,
  isLiked,
  isSaved,
}: IdeaCardProps) {
  return (
    <div className="rounded-lg border border-border bg-card/50 p-6 hover:border-cyan/30 hover:bg-card transition-all">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-lg">{idea.title}</h3>
            {matchScore !== undefined && (
              <Badge className="bg-cyan/10 text-cyan border-cyan/20">
                {matchScore}% match
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground text-sm mt-2 line-clamp-2">
            {idea.description}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4 flex-wrap">
        {idea.difficulty && (
          <Badge
            variant="outline"
            className={cn("text-xs", difficultyColors[idea.difficulty])}
          >
            {idea.difficulty}
          </Badge>
        )}
        {idea.revenue_model && (
          <Badge variant="secondary" className="text-xs">
            {idea.revenue_model}
          </Badge>
        )}
        {idea.estimated_startup_cost && (
          <Badge variant="outline" className="text-xs">
            {idea.estimated_startup_cost}
          </Badge>
        )}
      </div>

      {idea.target_market && (
        <p className="text-xs text-muted-foreground mt-3">
          Target: {idea.target_market}
        </p>
      )}

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
        <div className="flex items-center gap-3">
          <button
            onClick={onLike}
            className={cn(
              "flex items-center gap-1 text-xs transition-colors",
              isLiked
                ? "text-red-400"
                : "text-muted-foreground hover:text-red-400"
            )}
          >
            <Heart className={cn("w-4 h-4", isLiked && "fill-current")} />
            <span>{idea.like_count}</span>
          </button>
          <button
            onClick={onSave}
            className={cn(
              "flex items-center gap-1 text-xs transition-colors",
              isSaved
                ? "text-cyan"
                : "text-muted-foreground hover:text-cyan"
            )}
          >
            <Bookmark className={cn("w-4 h-4", isSaved && "fill-current")} />
            <span>{idea.save_count}</span>
          </button>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Eye className="w-4 h-4" />
            <span>{idea.view_count}</span>
          </span>
        </div>

        {onSelect && (
          <Button
            size="sm"
            className="bg-cyan text-background hover:bg-cyan/90"
            onClick={onSelect}
          >
            Start This Business
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        )}
      </div>
    </div>
  )
}
