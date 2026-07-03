/** @type {import('next').NextConfig} */
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // hpx-v2 lives inside the old portfolio repo — pin the root so Next
  // doesn't inherit the parent project's lockfile/config.
  outputFileTracingRoot: path.dirname(fileURLToPath(import.meta.url)),
  // The parent repo's ESLint config (browser-only globals) leaks into this
  // nested project and false-flags Node globals — don't let it block builds.
  eslint: { ignoreDuringBuilds: true },
  images: {
    // Plain <img> tags are used site-wide to keep the runtime dependency-free
    // (no sharp binary needed on shared hosting).
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ]
  },
}

export default nextConfig
