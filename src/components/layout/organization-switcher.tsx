"use client"

import { useRouter } from "next/navigation"
import { Building2Icon, ChevronsUpDownIcon } from "lucide-react"
import { toast } from "sonner"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export type ActiveOrganization = {
  name: string
  slug: string
  plan: "Free" | "Pro"
  role: "Admin" | "Owner" | "Board" | "Staff" | "User" | "Viewer"
}

const organizations: ActiveOrganization[] = [
  { name: "My Business", slug: "my-business", plan: "Free", role: "Owner" },
]

export function OrganizationSwitcher({ activeOrganization }: { activeOrganization: ActiveOrganization }) {
  const router = useRouter()

  function switchOrganization(organization: ActiveOrganization) {
    toast.success(`Organization switched to ${organization.name}.`)
    router.push(`/${organization.slug}/workstation`)
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger render={<SidebarMenuButton size="lg" tooltip="Organization" />}>
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <Building2Icon className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{activeOrganization.name}</span>
              <span className="truncate text-xs">{activeOrganization.plan} · {activeOrganization.role}</span>
            </div>
            <ChevronsUpDownIcon className="ml-auto size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" side="right" className="w-64">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Organizations</DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            {organizations.map((organization) => (
              <DropdownMenuItem key={organization.slug} onClick={() => switchOrganization(organization)}>
                <Building2Icon className="size-4" />
                <span className="grid gap-0.5">
                  <span>{organization.name}</span>
                  <span className="text-xs text-muted-foreground">{organization.plan} · {organization.role}</span>
                </span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
