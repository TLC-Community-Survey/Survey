import React from 'react'
import { Link } from 'react-router-dom'
import { setConsent } from '../utils/cookies'

function CookieConsentModal({ isOpen, onAccept, onDecline }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-notion-bg-secondary rounded-lg p-6 max-w-lg w-full mx-4">
        <h3 className="text-2xl font-semibold mb-4 text-notion-text">Cookie Notice</h3>
        
        <div className="space-y-4 text-notion-text-secondary mb-6">
          <p>
            We use session cookies to maintain your survey progress and ensure data integrity. 
            These cookies expire after 20 minutes of inactivity.
          </p>
          <p className="text-sm">
            <strong>What we use cookies for:</strong>
          </p>
          <ul className="text-sm list-disc list-inside space-y-1 ml-2">
            <li>Maintaining your survey session</li>
            <li>Preventing duplicate submissions</li>
            <li>Ensuring data integrity</li>
          </ul>
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
            onClick={() => {
              setConsent(false)
              onDecline()
            }}
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

