/**
 * Authentication service using cookies
 * 
 * NOTE: This can be replaced with Vookie/link integration later.
 * To integrate Vookie/link:
 * 1. Replace setAuth() to use Vookie/link's authentication method
 * 2. Replace getAuth() to retrieve user info from Vookie/link
 * 3. Replace clearAuth() to use Vookie/link's logout method
 * 4. Update the AuthModal component to use Vookie/link's UI if available
 */

const AUTH_COOKIE_NAME = 'tlc_survey_auth'
const AUTH_COOKIE_MAX_AGE = 30 * 24 * 60 * 60 // 30 days

/**
 * Set authentication cookie
 * @param {string} discordName - Discord username
 */
export function setAuth(discordName) {
  document.cookie = `${AUTH_COOKIE_NAME}=${encodeURIComponent(discordName)}; max-age=${AUTH_COOKIE_MAX_AGE}; path=/; SameSite=Lax`
}

/**
 * Get authenticated user from cookie
 * @returns {string|null} Discord username or null if not authenticated
 */
export function getAuth() {
  const cookies = document.cookie.split(';')
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=')
    if (name === AUTH_COOKIE_NAME) {
      return decodeURIComponent(value)
    }
  }
  return null
}

/**
 * Clear authentication
 */
export function clearAuth() {
  document.cookie = `${AUTH_COOKIE_NAME}=; max-age=0; path=/`
}

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
export function isAuthenticated() {
  return getAuth() !== null
}

