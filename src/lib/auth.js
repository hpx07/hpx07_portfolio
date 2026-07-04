// Edge-safe auth utilities (Web Crypto only — usable in middleware and Node routes).

const COOKIE_NAME = 'hpx_session'
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000 // 7 days

const enc = new TextEncoder()

function secret() {
  return process.env.AUTH_SECRET || 'hpx-dev-secret-change-me'
}

function b64url(bytes) {
  let bin = ''
  for (const b of bytes) bin += String.fromCharCode(b)
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function b64urlDecode(str) {
  const pad = str.length % 4 === 0 ? '' : '='.repeat(4 - (str.length % 4))
  const bin = atob(str.replace(/-/g, '+').replace(/_/g, '/') + pad)
  return bin
}

async function hmacKey() {
  return crypto.subtle.importKey(
    'raw',
    enc.encode(secret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  )
}

export async function createSessionToken(user) {
  const payload = JSON.stringify({ u: user, exp: Date.now() + SESSION_TTL_MS })
  const body = b64url(enc.encode(payload))
  const sig = await crypto.subtle.sign('HMAC', await hmacKey(), enc.encode(body))
  return `${body}.${b64url(new Uint8Array(sig))}`
}

export async function verifySessionToken(token) {
  try {
    if (!token || !token.includes('.')) return null
    const [body, sig] = token.split('.')
    const sigBin = b64urlDecode(sig)
    const sigBytes = new Uint8Array(sigBin.length)
    for (let i = 0; i < sigBin.length; i++) sigBytes[i] = sigBin.charCodeAt(i)
    const ok = await crypto.subtle.verify('HMAC', await hmacKey(), sigBytes, enc.encode(body))
    if (!ok) return null
    const payload = JSON.parse(b64urlDecode(body))
    if (!payload.exp || payload.exp < Date.now()) return null
    return payload
  } catch {
    return null
  }
}

export function checkCredentials(user, password) {
  const expectedUser = process.env.ADMIN_USER || 'admin'
  const expectedPass = process.env.ADMIN_PASSWORD || 'change-me-now'
  // constant-time-ish comparison
  const same = (a, b) => {
    const max = Math.max(a.length, b.length)
    let diff = a.length === b.length ? 0 : 1
    for (let i = 0; i < max; i++) diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0)
    return diff === 0
  }
  return same(String(user || ''), expectedUser) && same(String(password || ''), expectedPass)
}

export const SESSION_COOKIE = COOKIE_NAME
export const SESSION_MAX_AGE = SESSION_TTL_MS / 1000
