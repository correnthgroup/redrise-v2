import * as React from "react"

const MOBILE_BREAKPOINT = 768
const subscribe = (callback: () => void) => {
  const query = window.matchMedia("(max-width: " + (MOBILE_BREAKPOINT - 1) + "px)")
  query.addEventListener("change", callback)
  return () => query.removeEventListener("change", callback)
}
const getSnapshot = () => window.innerWidth < MOBILE_BREAKPOINT
const getServerSnapshot = () => false

export function useIsMobile() {
  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}