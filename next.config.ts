import { type NextConfig } from 'next'

const config: NextConfig = {
  reactStrictMode: true,
  typescript: {
    // This allows builds to complete even with TypeScript errors
    ignoreBuildErrors: true,
  },
  eslint: {
    // This allows builds to complete even with ESLint errors
    ignoreDuringBuilds: true,
  },
}

export default config
