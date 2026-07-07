"use client"

import Link from "next/link"
import { BellIcon, CheckCircle2Icon, CircleAlertIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type NotificationPopoverProps = {
  organizationSlug: string
}

const notifications = [
  {
    title: "Approvals are ready",
    description: "Pending approvals will live inside Settings > Notification.",
    time: "Now",
    approval: true,
  },
  {
    title: "Foundation setup",
    description: "Notification rules are placeholders until PRD-03 expands them.",
    time: "Today",
    approval: false,
  },
]

export function NotificationPopover({ organizationSlug }: NotificationPopoverProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button type="button" variant="ghost" size="icon" aria-label="Open notifications" />}>
        <BellIcon className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="right" className="w-80">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {notifications.map((notification) => (
          <DropdownMenuItem key={notification.title} render={<Link href={notification.approval ? `/${organizationSlug}/settings/notification` : `/${organizationSlug}/settings/notification`} />}>
            {notification.approval ? <CircleAlertIcon className="mt-0.5 size-4 text-muted-foreground" /> : <CheckCircle2Icon className="mt-0.5 size-4 text-muted-foreground" />}
            <span className="grid gap-0.5">
              <span className="text-sm font-medium">{notification.title}</span>
              <span className="text-xs leading-5 text-muted-foreground">{notification.description}</span>
              <span className="text-xs text-muted-foreground">{notification.time}</span>
            </span>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href={`/${organizationSlug}/settings/notification`} />}>
          View all notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
