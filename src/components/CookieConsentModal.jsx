import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { setConsent } from '../utils/cookies'

// Check if localStorage is available
function isLocalStorageAvailable() {
  try {
    const test = '__localStorage_test__'
    localStorage.setItem(test, test)
    localStorage.removeItem(test)
    return true
  } catch (e) {
    return false
  }
}

function CookieConsentModal({ isOpen, onAccept, onDecline }) {
  const [showThankYou, setShowThankYou] = useState(false)

  const handleDecline = () => {
    setConsent(false)
    // Check if localStorage is available
    if (!isLocalStorageAvailable()) {
      setShowThankYou(true)
    } else {
      onDecline()
    }
  }

  const handleThankYouOk = () => {
    window.location.href = 'https://google.com'
  }

  if (!isOpen) return null

  // Thank you modal if localStorage is not available
  if (showThankYou) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-notion-bg-secondary rounded-lg p-6 max-w-lg w-full mx-4">
          <h3 className="text-2xl font-semibold mb-4 text-notion-text">Thank You</h3>
          <p className="text-notion-text-secondary mb-6">
            Thank you for your interest. We appreciate your time.
          </p>
          <button
            onClick={handleThankYouOk}
            className="w-full px-6 py-3 bg-notion-accent hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors"
          >
            OK
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-notion-bg-secondary rounded-lg p-6 max-w-lg w-full mx-4">
        <h3 className="text-2xl font-semibold mb-4 text-notion-text">Cookie Notice</h3>
        
        <div className="space-y-4 text-notion-text-secondary mb-6">
          <p>
            We use session cookies and browser localStorage to maintain your survey progress and ensure data integrity. 
            Session cookies expire after 20 minutes of inactivity. Your form data is saved locally in your browser 
            and persists even if you close the page.
          </p>
          <p className="text-sm">
            <strong>What we use cookies and localStorage for:</strong>
          </p>
          <ul className="text-sm list-disc list-inside space-y-1 ml-2">
            <li>Maintaining your survey session</li>
            <li>Saving your form progress automatically (localStorage)</li>
            <li>Ensuring data integrity</li>
          </ul>
          <p className="text-sm text-notion-text-secondary mt-4">
            <strong>Note:</strong> All data stored in localStorage remains on your device and is never shared with third parties. 
            Your survey responses are only sent to our servers when you submit the completed form.
          </p>
          <p className="text-sm mt-4">
            For more detailed information, please see our{' '}
            <Link to="/cookie-policy" className="text-notion-accent hover:underline">
              Cookie Policy
            </Link>
            {' '}and{' '}
            <Link to="/methodology" className="text-notion-accent hover:underline">
              Privacy & Methodology
            </Link>
            .
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => {
              setConsent(true)
              onAccept()
            }}
            className="flex-1 px-6 py-3 bg-notion-accent hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors"
          >
            Accept Cookies
          </button>
          <button
            onClick={handleDecline}
            className="flex-1 px-6 py-3 bg-notion-bg-tertiary hover:bg-notion-bg-tertiary/80 text-notion-text rounded-lg transition-colors"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  )
}

export default CookieConsentModal

