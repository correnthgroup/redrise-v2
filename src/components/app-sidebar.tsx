"use client"

import * as React from "react"
import Link from "next/link"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { TerminalSquareIcon, BotIcon, BookOpenIcon, Settings2Icon, LifeBuoyIcon, SendIcon, FrameIcon, TerminalIcon } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { loadUserProfile, PROFILE_UPDATED_EVENT, type UserProfile } from "@/lib/user-profile"
import { loadProjects } from "@/lib/projects"
import { loadSettingsAdminContext } from "@/lib/team-members"

interface Project {
  id: string
  name: string
  url: string
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [projects, setProjects] = React.useState<Project[]>([])
  const [userProfile, setUserProfile] = React.useState<UserProfile | null>(null)

  React.useEffect(() => {
    try {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          loadUserProfile({
            id: session.user.id,
            name: session.user.user_metadata?.full_name || session.user.email || "",
              email: session.user.email || "",
            }).then(setUserProfile)
            loadSettingsAdminContext(session.user.id)
              .then((context) => loadProjects(context.ownerUserId))
              .then((items) => setProjects(items.map((project) => ({
                id: project.id,
                name: project.name,
                url: `/projects/${project.id}/resume`,
              }))))
              .catch(() => setProjects([]))
        }
      })
    } catch {
      // Supabase not configured
    }

    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as UserProfile
      if (detail) setUserProfile(detail)
    }
    window.addEventListener(PROFILE_UPDATED_EVENT, handler)
    return () => window.removeEventListener(PROFILE_UPDATED_EVENT, handler)
  }, [])

  const projectItems = projects.map((p) => ({ title: p.name, url: p.url }))

  const navMain = React.useMemo(() => [
    {
      title: "Workstation",
      url: "/workstation",
      icon: <TerminalSquareIcon />,
      isActive: true,
      items: [
        { title: "Space", url: "/workstation/workspace" },
        { title: "Process", url: "/workstation/workflow" },
        { title: "Action", url: "/workstation/workaction" },
      ],
    },
    {
      title: "Agents",
      url: "/agents",
      icon: <BotIcon />,
      items: [
        { title: "Models", url: "/agents/models" },
        { title: "Engine", url: "/agents/engine" },
        { title: "Analytics", url: "/agents/analytics" },
      ],
    },
    {
      title: "Documentation",
      url: "/documentation",
      icon: <BookOpenIcon />,
      items: [
        { title: "Introduction", url: "/documentation/introduction" },
        { title: "Get Started", url: "/documentation/get-started" },
        { title: "Tutorials", url: "/documentation/tutorials" },
        { title: "Changelog", url: "/documentation/changelog" },
      ],
    },
    {
      title: "Settings",
      url: "/settings",
      icon: <Settings2Icon />,
      items: [
        { title: "Profile", url: "/settings?section=profile" },
        { title: "Team", url: "/settings?section=team" },
        { title: "Notification", url: "/settings?section=notification" },
        { title: "Integration", url: "/settings?section=integration" },
      ],
    },
    {
      title: "Projects",
      url: "/projects",
      icon: <FrameIcon />,
        items: projectItems,
      },
  ], [projectItems])

  const sidebarUser = React.useMemo(() => {
    if (!userProfile) return { name: "Loading...", email: "", avatar: "" }
    const fullName = `${userProfile.firstName} ${userProfile.lastName}`.trim() || userProfile.email
    return {
      name: fullName,
      email: userProfile.email,
      avatar: userProfile.avatarUrl || "",
    }
  }, [userProfile])

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link href="/workstation" />}>
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <TerminalIcon className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">Redrise</span>
                <span className="truncate text-xs">Enterprise</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavSecondary items={[
          { title: "Support", url: "#", icon: <LifeBuoyIcon /> },
          { title: "Feedback", url: "#", icon: <SendIcon /> },
        ]} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={sidebarUser} />
      </SidebarFooter>
    </Sidebar>
  )
}
