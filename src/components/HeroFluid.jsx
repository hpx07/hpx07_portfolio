'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

const SplashCursor = dynamic(() => import('@/components/SplashCursor'), { ssr: false })

// Mounts the WebGL fluid simulation only on capable devices, after the page
// is idle — keeps the hero instant on low-end phones and slow networks.
export default function HeroFluid() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const finePointer = window.matchMedia('(pointer: fine)').matches
    const cores = navigator.hardwareConcurrency || 4
    if (reduced || !finePointer || cores <= 2) return
    const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 600))
    const id = idle(() => setEnabled(true))
    return () => (window.cancelIdleCallback || clearTimeout)(id)
  }, [])

  if (!enabled) return null
  return (
    <div className="hero-fluid" aria-hidden="true">
      <SplashCursor
        SIM_RESOLUTION={128}
        DYE_RESOLUTION={1024}
        DENSITY_DISSIPATION={4.2}
        VELOCITY_DISSIPATION={2.2}
        PRESSURE={0.15}
        CURL={3}
        SPLAT_RADIUS={0.18}
        SPLAT_FORCE={5200}
        COLOR_UPDATE_SPEED={10}
        RAINBOW_MODE
        TRANSPARENT
      />
    </div>
  )
}
