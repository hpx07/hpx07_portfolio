'use client'

import { useEffect, useState } from 'react'

// Theme switcher. The active theme lives on <html data-theme="…">; an inline
// script in the root layout applies the stored choice before first paint, so
// there is never a flash of the wrong theme. Cycles through all three themes;
// the button shows the *current* theme's icon.
const THEMES = ['dark', 'light', 'pine']
const LABELS = {
  dark: 'Ember & Ivory',
  light: 'Ivory Ledger',
  pine: 'Pine & Cobalt',
}

function ThemeIcon({ theme }) {
  if (theme === 'light') {
    // sun
    return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
    )
  }
  if (theme === 'pine') {
    // leaf — the green+blue "Pine & Cobalt" theme
    return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" />
        <path d="M2 21c0-3 1.85-5.36 5.08-6" />
      </svg>
    )
  }
  // moon (dark)
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
  )
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    const t = document.documentElement.dataset.theme
    setTheme(THEMES.includes(t) ? t : 'dark')
  }, [])

  const cycle = () => {
    const next = THEMES[(THEMES.indexOf(theme) + 1) % THEMES.length]
    document.documentElement.dataset.theme = next
    try {
      localStorage.setItem('hpx_theme', next)
    } catch {
      /* private mode */
    }
    setTheme(next)
  }

  const nextTheme = THEMES[(THEMES.indexOf(theme) + 1) % THEMES.length]

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={cycle}
      aria-label={`Theme: ${LABELS[theme]}. Switch to ${LABELS[nextTheme]}`}
      title={`Theme: ${LABELS[theme]} — click for ${LABELS[nextTheme]}`}
    >
      <ThemeIcon theme={theme} />
    </button>
  )
}
