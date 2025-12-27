/**
 * Sanitization utilities for survey data
 * Provides rate limiting, content filtering, and data validation
 */

/**
 * Rate limiting: Check if IP has exceeded submission limit
 * @param {KVNamespace} kv - KV namespace for rate limiting
 * @param {string} ip - IP address
 * @param {number} limitPerHour - Maximum submissions per hour (default: 10)
 * @returns {Promise<{allowed: boolean, remaining: number, resetAt: number}>}
 */
export async function checkRateLimit(kv, ip, limitPerHour = 10) {
  if (!kv || !ip) {
    return { allowed: true, remaining: limitPerHour, resetAt: Date.now() + 3600000 }
  }

  const key = `rate_limit:${ip}`
  const now = Date.now()
  const hourAgo = now - 3600000 // 1 hour in milliseconds

  try {
    const data = await kv.get(key, { type: 'json' })
    
    if (!data) {
      // First submission from this IP
      await kv.put(key, JSON.stringify({
        count: 1,
        resetAt: now + 3600000
      }), { expirationTtl: 3600 })
      return { allowed: true, remaining: limitPerHour - 1, resetAt: now + 3600000 }
    }

    // Check if window has expired
    if (data.resetAt < now) {
      await kv.put(key, JSON.stringify({
        count: 1,
        resetAt: now + 3600000
      }), { expirationTtl: 3600 })
      return { allowed: true, remaining: limitPerHour - 1, resetAt: now + 3600000 }
    }

    // Check if limit exceeded
    if (data.count >= limitPerHour) {
      return { allowed: false, remaining: 0, resetAt: data.resetAt }
    }

    // Increment count
    const newCount = data.count + 1
    await kv.put(key, JSON.stringify({
      count: newCount,
      resetAt: data.resetAt
    }), { expirationTtl: Math.ceil((data.resetAt - now) / 1000) })

    return { allowed: true, remaining: limitPerHour - newCount, resetAt: data.resetAt }
  } catch (error) {
    console.error('Rate limit check error:', error)
    // On error, allow submission but log it
    return { allowed: true, remaining: limitPerHour, resetAt: now + 3600000 }
  }
}

/**
 * Content filtering: Detect profanity and malicious patterns
 * @param {string} text - Text to check
 * @returns {Promise<{safe: boolean, reason?: string}>}
 */
export async function filterContent(text) {
  if (!text || typeof text !== 'string') {
    return { safe: true }
  }

  // Basic profanity patterns (common words - expand as needed)
  const profanityPatterns = [
    /\b(fuck|shit|damn|bitch|asshole|bastard|crap)\b/gi,
    // Add more patterns as needed
  ]

  // SQL injection patterns
  const sqlInjectionPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE|UNION|SCRIPT)\b)/gi,
    /('|(\\')|(;)|(--)|(\/\*)|(\*\/)|(\+)|(\%27)|(\%22))/gi,
    /((\%3D)|(=))[^\n]*((\%27)|(')|(\-\-)|(\%3B)|(;))/gi,
  ]

  // XSS patterns
  const xssPatterns = [
    /<script[^>]*>.*?<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi, // onclick=, onerror=, etc.
    /<iframe[^>]*>/gi,
    /<object[^>]*>/gi,
    /<embed[^>]*>/gi,
  ]

  // Check for profanity
  for (const pattern of profanityPatterns) {
    if (pattern.test(text)) {
      return { safe: false, reason: 'Profanity detected' }
    }
  }

  // Check for SQL injection
  for (const pattern of sqlInjectionPatterns) {
    if (pattern.test(text)) {
      return { safe: false, reason: 'SQL injection pattern detected' }
    }
  }

  // Check for XSS
  for (const pattern of xssPatterns) {
    if (pattern.test(text)) {
      return { safe: false, reason: 'XSS pattern detected' }
    }
  }

  // Check for suspiciously long strings (potential DoS)
  if (text.length > 10000) {
    return { safe: false, reason: 'Text exceeds maximum length' }
  }

  // Check for excessive special characters (potential encoding attacks)
  const specialCharRatio = (text.match(/[^a-zA-Z0-9\s]/g) || []).length / text.length
  if (specialCharRatio > 0.5 && text.length > 100) {
    return { safe: false, reason: 'Excessive special characters detected' }
  }

  return { safe: true }
}

/**
 * Validate survey data structure and values
 * @param {object} data - Survey submission data
 * @returns {Promise<{valid: boolean, errors?: string[]}>}
 */
export async function validateSurveyData(data) {
  const errors = []

  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['Invalid data structure'] }
  }

  // Validate age if present
  if (data.age !== undefined && data.age !== null) {
    const age = parseInt(data.age)
    if (isNaN(age) || age < 16 || age > 120) {
      errors.push('Age must be between 16 and 120')
    }
  }

  // Validate FPS values if present
  if (data.avgFpsPreCu1 !== undefined && data.avgFpsPreCu1 !== null) {
    const fps = parseInt(data.avgFpsPreCu1)
    if (isNaN(fps) || fps < 0 || fps > 1000) {
      errors.push('Invalid FPS value (pre-CU1)')
    }
  }

  if (data.avgFpsPostCu1 !== undefined && data.avgFpsPostCu1 !== null) {
    const fps = parseInt(data.avgFpsPostCu1)
    if (isNaN(fps) || fps < 0 || fps > 1000) {
      errors.push('Invalid FPS value (post-CU1)')
    }
  }

  // Validate rating values (1-5 scale)
  const ratingFields = [
    'overallClientStability', 'overallStability', 'preCu1QuestsRating',
    'motherRating', 'theOneBeforeMeRating', 'theWarehouseRating',
    'whispersWithinRating', 'smileAtDarkRating', 'storyEngagement',
    'overallQuestStoryRating', 'overallQuestRating', 'overallScorePostCu1', 'overallScore'
  ]

  for (const field of ratingFields) {
    if (data[field] !== undefined && data[field] !== null) {
      const rating = parseInt(data[field])
      if (isNaN(rating) || rating < 1 || rating > 5) {
        errors.push(`Invalid rating value for ${field}`)
      }
    }
  }

  // Validate text fields length
  const textFields = [
    'cpu', 'gpu', 'ram', 'storage', 'playtime', 'discordName',
    'questProgress', 'openFeedbackSpace', 'bugOtherText'
  ]

  for (const field of textFields) {
    if (data[field] !== undefined && data[field] !== null) {
      const value = String(data[field])
      if (value.length > 500) {
        errors.push(`${field} exceeds maximum length`)
      }
    }
  }

  // Validate response_id format if present
  if (data.responseId && typeof data.responseId === 'string') {
    if (!/^TLC-LH-\d+$/.test(data.responseId)) {
      errors.push('Invalid response ID format')
    }
  }

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined
  }
}

/**
 * Sanitize all text fields in survey data
 * @param {object} data - Survey submission data
 * @returns {Promise<{sanitized: object, issues: string[]}>}
 */
export async function sanitizeSurveyData(data) {
  const sanitized = { ...data }
  const issues = []

  // List of text fields to sanitize
  const textFields = [
    'cpu', 'gpu', 'ram', 'storage', 'playtime', 'discordName',
    'questProgress', 'openFeedbackSpace', 'bugOtherText',
    'preCu1VsPost', 'performanceChange', 'whichQuestPoi',
    'methodUsedToResolveBoat1', 'methodUsedToResolveBoat2',
    'methodUsedToResolveElevator', 'whatPoiElevator'
  ]

  for (const field of textFields) {
    if (sanitized[field] !== undefined && sanitized[field] !== null) {
      const value = String(sanitized[field])
      
      // Check content safety
      const contentCheck = await filterContent(value)
      if (!contentCheck.safe) {
        issues.push(`${field}: ${contentCheck.reason}`)
        // Remove unsafe content
        sanitized[field] = null
        continue
      }

      // Trim whitespace
      sanitized[field] = value.trim()

      // Remove null bytes and control characters
      sanitized[field] = sanitized[field].replace(/[\x00-\x1F\x7F]/g, '')
    }
  }

  // Sanitize JSON fields
  if (sanitized.commonBugsExperienced && typeof sanitized.commonBugsExperienced === 'string') {
    try {
      const bugs = JSON.parse(sanitized.commonBugsExperienced)
      if (Array.isArray(bugs)) {
        const sanitizedBugs = []
        for (const bug of bugs) {
          const bugCheck = await filterContent(String(bug))
          if (bugCheck.safe) {
            sanitizedBugs.push(bug)
          }
        }
        sanitized.commonBugsExperienced = JSON.stringify(sanitizedBugs)
      }
    } catch (e) {
      // Invalid JSON, remove it
      sanitized.commonBugsExperienced = null
      issues.push('commonBugsExperienced: Invalid JSON')
    }
  }

  return { sanitized, issues }
}

/**
 * Get client IP from request
 * @param {Request} request - HTTP request
 * @returns {string}
 */
export function getClientIP(request) {
  // Cloudflare provides the real IP in CF-Connecting-IP header
  const cfIP = request.headers.get('CF-Connecting-IP')
  if (cfIP) return cfIP

  // Fallback to X-Forwarded-For
  const forwarded = request.headers.get('X-Forwarded-For')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }

  // Last resort
  return 'unknown'
}

