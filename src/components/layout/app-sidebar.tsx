"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRightIcon, FlameIcon } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useSidebar } from "@/components/ui/sidebar-context"
import { ActiveOrganization, OrganizationSwitcher } from "@/components/layout/organization-switcher"
import { NotificationPopover } from "@/components/layout/notification-popover"
import { getSidebarRoutes } from "@/components/layout/sidebar-routes"

function isRouteActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`)
}

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  organizationSlug: string
  activeOrganization: ActiveOrganization
}

export function AppSidebar({ organizationSlug, activeOrganization, ...props }: AppSidebarProps) {
  const pathname = usePathname()
  const { state, toggleSidebar } = useSidebar()
  const routes = React.useMemo(() => getSidebarRoutes(organizationSlug).filter((route) => route.visible), [organizationSlug])
  const activeRouteTitles = React.useMemo(
    () => routes.filter((route) => isRouteActive(pathname, route.href)).map((route) => route.title),
    [pathname, routes],
  )
  const [openRouteTitles, setOpenRouteTitles] = React.useState<string[]>(activeRouteTitles)

  React.useEffect(() => {
    setOpenRouteTitles((current) => Array.from(new Set([...current, ...activeRouteTitles])))
  }, [activeRouteTitles])

  function handleLogoClick(event: React.MouseEvent) {
    if (state === "collapsed") {
      event.preventDefault()
      toggleSidebar()
    }
  }

  return (
    <Sidebar variant="floating" collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-1">
              <SidebarMenuButton size="lg" tooltip="RedRise" onClick={handleLogoClick} render={<Link href={`/${organizationSlug}/workstation`} />}>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <FlameIcon className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">RedRise</span>
                  <span className="truncate text-xs">{activeOrganization.name}</span>
                </div>
              </SidebarMenuButton>
              <div className="flex items-center gap-1 group-data-[collapsible=icon]:hidden">
                <NotificationPopover organizationSlug={organizationSlug} />
                <SidebarTrigger className="size-8" />
              </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {routes.map((route) => {
                const items = route.items?.filter((item) => item.visible) ?? []
                const active = isRouteActive(pathname, route.href)

                if (!items.length) {
                  return (
                    <SidebarMenuItem key={route.title}>
                      <SidebarMenuButton tooltip={route.title} isActive={active} render={<Link href={route.href} />}>
                        {route.icon}
                        <span>{route.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                }

                return (
                  <Collapsible
                    key={route.title}
                    open={openRouteTitles.includes(route.title)}
                    onOpenChange={(open) => {
                      setOpenRouteTitles((current) => open
                        ? Array.from(new Set([...current, route.title]))
                        : current.filter((title) => title !== route.title),
                      )
                    }}
                    render={<SidebarMenuItem />}
                  >
                    <SidebarMenuButton tooltip={route.title} isActive={active} render={<Link href={route.href} />}>
                      {route.icon}
                      <span>{route.title}</span>
                    </SidebarMenuButton>
                    <CollapsibleTrigger render={<SidebarMenuAction className="aria-expanded:rotate-90" />}>
                      <ChevronRightIcon />
                      <span className="sr-only">Toggle {route.title}</span>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {items.map((item) => (
                          <SidebarMenuSubItem key={item.href}>
                            <SidebarMenuSubButton isActive={pathname === item.href} render={<Link href={item.href} />}>
                              <span>{item.title}</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </Collapsible>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <OrganizationSwitcher activeOrganization={activeOrganization} />
      </SidebarFooter>
    </Sidebar>
  )
}
