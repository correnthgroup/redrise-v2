import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  // cacheComponents is intentionally not enabled; use standard App Router revalidation for now.
}

export default nextConfig
