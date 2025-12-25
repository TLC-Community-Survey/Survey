/**
 * Cookie utility functions for managing session cookies
 * Sessions persist for at least 20 minutes
 */

const SESSION_DURATION = 20 * 60 * 1000 // 20 minutes in milliseconds
const CONSENT_COOKIE = 'cookie_consent'
const SESSION_COOKIE = 'survey_session'

/**
 * Set a cookie with expiration
 * @param {string} name - Cookie name
 * @param {string} value - Cookie value
 * @param {number} maxAge - Max age in milliseconds
 */
export function setCookie(name, value, maxAge) {
  const expires = new Date(Date.now() + maxAge).toUTCString()
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`
}

/**
 * Get a cookie value
 * @param {string} name - Cookie name
 * @returns {string|null} Cookie value or null if not found
 */
export function getCookie(name) {
  const nameEQ = name + '='
  const ca = document.cookie.split(';')
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === ' ') c = c.substring(1, c.length)
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
  }
  return null
}

/**
 * Delete a cookie
 * @param {string} name - Cookie name
 */
export function deleteCookie(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
}

/**
 * Check if user has given cookie consent
 * @returns {boolean}
 */
export function hasConsent() {
  return getCookie(CONSENT_COOKIE) === 'accepted'
}

/**
 * Set cookie consent
 * @param {boolean} accepted - Whether user accepted cookies
 */
export function setConsent(accepted) {
  if (accepted) {
    // Set consent cookie (expires in 1 year)
    setCookie(CONSENT_COOKIE, 'accepted', 365 * 24 * 60 * 60 * 1000)
    // Set session cookie (expires in 20 minutes)
    setSessionCookie()
  } else {
    deleteCookie(CONSENT_COOKIE)
    deleteCookie(SESSION_COOKIE)
  }
}

/**
 * Set or refresh session cookie
 */
export function setSessionCookie() {
  const sessionId = generateSessionId()
  setCookie(SESSION_COOKIE, sessionId, SESSION_DURATION)
  return sessionId
}

/**
 * Get current session ID
 * @returns {string|null}
 */
export function getSessionId() {
  return getCookie(SESSION_COOKIE)
}

/**
 * Check if session is still valid
 * @returns {boolean}
 */
export function isSessionValid() {
  return getSessionId() !== null
}

/**
 * Refresh session cookie if it exists
 * @returns {boolean} True if session was refreshed, false otherwise
 */
export function refreshSession() {
  if (hasConsent() && isSessionValid()) {
    setSessionCookie()
    return true
  }
  return false
}

/**
 * Generate a unique session ID
 * @returns {string}
 */
function generateSessionId() {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`
}

