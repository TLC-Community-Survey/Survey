/**
 * Middleware for /admin/api/* routes
 * This middleware runs before individual API endpoint handlers
 * Parent middleware at functions/admin/_middleware.js handles authentication and rate limiting
 * This middleware just ensures we're on an API route and passes through
 */

export async function onRequest(context) {
  // Parent middleware handles authentication and rate limiting
  // Just pass through to the API handlers
  return context.next()
}

