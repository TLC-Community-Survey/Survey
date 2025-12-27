/**
 * API service for submitting survey data to Cloudflare D1 database
 */

const API_BASE = '/api'

/**
 * Submit survey form data to D1 database
 * @param {Object} formData - Form data to submit
 * @returns {Promise<Object>} Response from API
 */
export async function submitSurvey(formData) {
  try {
    const response = await fetch('/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`
      try {
        const error = await response.json()
        errorMessage = error.message || error.error || errorMessage
      } catch (e) {
        // If response is not JSON, try to get text
        try {
          const text = await response.text()
          if (text && text.length < 200) {
            errorMessage = text
          }
        } catch (textError) {
          // Ignore text parsing errors
        }
      }
      throw new Error(errorMessage)
    }

    return await response.json()
  } catch (error) {
    console.error('Error submitting survey:', error)
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    })
    
    // Enhance error message for network errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      // Check if we're in development mode
      const isDevelopment = import.meta.env.DEV || process.env.NODE_ENV === 'development'
      
      if (isDevelopment) {
        // In development, provide more helpful error message
        throw new Error('Network error: Unable to connect to the API server. Make sure you are running the app with `npm run dev:full` (not just `npm run dev`) to enable Cloudflare Pages Functions.')
      } else {
        // In production, generic error message
        throw new Error('Network error: Unable to connect to the server. Please check your internet connection and try again.')
      }
    }
    throw error
  }
}

