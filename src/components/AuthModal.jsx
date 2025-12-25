import React, { useState } from 'react'
import { setAuth } from '../services/auth'

function AuthModal({ isOpen, onClose, onSuccess }) {
  const [discordName, setDiscordName] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!discordName.trim()) {
      setError('Please enter your Discord name')
      return
    }

    // Set authentication cookie
    setAuth(discordName.trim())
    
    // Call success callback
    if (onSuccess) {
      onSuccess(discordName.trim())
    }
    
    // Close modal
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-notion-surface rounded-lg max-w-md w-full p-6">
        <h2 className="text-2xl font-semibold text-notion-text mb-4">Authenticate</h2>
        <p className="text-notion-text-muted mb-6">
          Enter your Discord name to view personalized dashboard data and comparisons.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-notion-text mb-2">
              Discord Name
            </label>
            <input
              type="text"
              value={discordName}
              onChange={(e) => {
                setDiscordName(e.target.value)
                setError('')
              }}
              placeholder="Your Discord username"
              className="w-full px-4 py-2 bg-notion-bg border border-notion-border rounded-lg text-notion-text focus:outline-none focus:ring-2 focus:ring-notion-blue"
              autoFocus
            />
            {error && (
              <p className="text-red-500 text-sm mt-1">{error}</p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-notion-border rounded-lg text-notion-text hover:bg-notion-bg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-notion-blue text-white rounded-lg hover:bg-notion-blue-hover transition-colors"
            >
              Authenticate
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AuthModal

