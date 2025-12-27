/**
 * Admin index handler
 * This file handles /admin routes (non-API routes)
 * API routes are handled by individual files in functions/admin/api/
 * Middleware at functions/admin/_middleware.js handles authentication for all /admin/* routes
 */

export async function onRequest(context) {
  // For non-API admin routes, just pass through to the frontend
  // The React app will handle routing
  return context.next()
}

