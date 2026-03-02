"use client"

import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

export default function DashboardError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-destructive mx-auto" />
        <h2 className="text-xl font-semibold">Something went wrong</h2>
        <p className="text-muted-foreground max-w-md">
          We encountered an error loading this page. Please try again.
        </p>
        <Button
          onClick={reset}
          className="bg-cyan text-background hover:bg-cyan/90"
        >
          Try Again
        </Button>
      </div>
    </div>
  )
}
