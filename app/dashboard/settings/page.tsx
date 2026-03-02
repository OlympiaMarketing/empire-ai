import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Settings, CreditCard, User } from "lucide-react"

export default async function SettingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account and preferences.
        </p>
      </div>

      {/* Profile Section */}
      <div className="rounded-lg border border-border bg-card/50 p-6">
        <div className="flex items-center gap-3 mb-4">
          <User className="w-5 h-5 text-cyan" />
          <h2 className="text-lg font-semibold">Profile</h2>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Name</span>
            <span>{profile?.full_name || "Not set"}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Email</span>
            <span>{profile?.email || user.email}</span>
          </div>
        </div>
      </div>

      {/* Billing Section */}
      <div id="billing" className="rounded-lg border border-border bg-card/50 p-6">
        <div className="flex items-center gap-3 mb-4">
          <CreditCard className="w-5 h-5 text-cyan" />
          <h2 className="text-lg font-semibold">Billing</h2>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Current Plan</span>
            <Badge className="bg-cyan/10 text-cyan border-cyan/20 capitalize">
              {profile?.subscription_tier || "free"}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Status</span>
            <Badge variant="outline" className="capitalize">
              {profile?.subscription_status || "inactive"}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  )
}
