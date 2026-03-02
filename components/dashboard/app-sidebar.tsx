"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  TrendingUp,
  Lightbulb,
  Bookmark,
  Settings,
  CreditCard,
  LogOut,
  FileText,
  Scale,
  Landmark,
  Globe,
  Megaphone,
  Rocket,
  DollarSign,
} from "lucide-react"

const discoverItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Trending Now", url: "/dashboard/trends", icon: TrendingUp },
  { title: "Business Ideas", url: "/dashboard/ideas", icon: Lightbulb },
  { title: "Saved Ideas", url: "/dashboard/saved", icon: Bookmark },
]

const businessItems = [
  { title: "Planning", url: "/dashboard/business/planning", icon: FileText },
  { title: "Legal & Docs", url: "/dashboard/business/legal", icon: Scale },
  { title: "Banking", url: "/dashboard/business/banking", icon: Landmark },
  { title: "Website", url: "/dashboard/business/website", icon: Globe },
  { title: "Operations", url: "/dashboard/business/operations", icon: Rocket },
  { title: "Marketing", url: "/dashboard/business/marketing", icon: Megaphone },
  { title: "Funding", url: "/dashboard/business/funding", icon: DollarSign },
]

const accountItems = [
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
  { title: "Billing", url: "/dashboard/settings#billing", icon: CreditCard },
]

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-cyan flex items-center justify-center">
            <span className="font-bold text-background text-sm">E</span>
          </div>
          <span className="font-bold text-lg">Empire.AI</span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Discover</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {discoverItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                  >
                    <Link href={item.url}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>My Business</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {businessItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                  >
                    <Link href={item.url}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {accountItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                  >
                    <Link href={item.url}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-foreground"
          onClick={handleSignOut}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}
