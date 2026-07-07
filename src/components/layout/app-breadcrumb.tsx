"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { routeLabels } from "@/components/layout/sidebar-routes"

function getCrumbs(pathname: string) {
  const segments = pathname.split("/").filter(Boolean)
  const routeSegments = segments.slice(1)

  return routeSegments.map((segment, index) => {
    const href = `/${segments.slice(0, index + 2).join("/")}`
    return {
      href,
      label: routeLabels[segment]?.label ?? segment,
      current: index === routeSegments.length - 1,
    }
  })
}

export function AppBreadcrumb() {
  const pathname = usePathname()
  const crumbs = getCrumbs(pathname)

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {crumbs.map((crumb, index) => (
          <React.Fragment key={crumb.href}>
            <BreadcrumbItem className={index === 0 ? "hidden md:block" : undefined}>
              {crumb.current ? (
                <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink render={<Link href={crumb.href} />}>
                  {crumb.label}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {!crumb.current ? <BreadcrumbSeparator className="hidden md:block" /> : null}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
