import React, { useRef, useEffect } from 'react'
import FormField from './FormField'

const POSTING_OPTIONS = ['Discord', 'Channel 37 Support e-mail', 'In Game Feedback', 'Reddit', 'Other']

function BugDetailsModal({ bugName, isOpen, onClose, formData, handleChange, handleMultiSelect }) {
  const modalRef = useRef(null)

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const getBugFields = () => {
    switch (bugName) {
      case 'Boat Stuck':
        return {
          postedAbout: formData.postedAboutIssuesBoat1 || [],
          postedAboutKey: 'postedAboutIssuesBoat1',
          methodUsed: formData.methodUsedToResolveBoat1 || '',
          methodUsedKey: 'methodUsedToResolveBoat1',
          linkToPost: formData.linkToPostBoat1 || '',
          linkToPostKey: 'linkToPostBoat1',
          wasResolved: formData.wasItResolvedBoat1 || false,
          wasResolvedKey: 'wasItResolvedBoat1',
        }
      case 'Boat Sinking/Flying':
        return {
          postedAbout: formData.postedAboutIssuesBoat2 || [],
          postedAboutKey: 'postedAboutIssuesBoat2',
          methodUsed: formData.methodUsedToResolveBoat2 || '',
          methodUsedKey: 'methodUsedToResolveBoat2',
          linkToPost: formData.linkToPostBoat2 || '',
          linkToPostKey: 'linkToPostBoat2',
          wasResolved: formData.wasItResolvedBoat2 || false,
          wasResolvedKey: 'wasItResolvedBoat2',
        }
      case 'Elevator issues':
        return {
          postedAbout: formData.postedAboutIssuesElevator || [],
          postedAboutKey: 'postedAboutIssuesElevator',
          methodUsed: formData.methodUsedToResolveElevator || '',
          methodUsedKey: 'methodUsedToResolveElevator',
          linkToPost: formData.linkToPostElevator || '',
          linkToPostKey: 'linkToPostElevator',
          wasResolved: formData.wasItResolvedElevator || false,
          wasResolvedKey: 'wasItResolvedElevator',
          poi: formData.whatPoiElevator || '',
          poiKey: 'whatPoiElevator',
        }
      case 'Sliding buildings on boat':
        return {
          postedAbout: formData.postedAboutIssuesSliding || [],
          postedAboutKey: 'postedAboutIssuesSliding',
          picture: formData.pictureSliding || '',
          pictureKey: 'pictureSliding',
          linkToPost: formData.linkToPostSliding || '',
          linkToPostKey: 'linkToPostSliding',
          wasResolved: formData.wasItResolvedSliding || false,
          wasResolvedKey: 'wasItResolvedSliding',
        }
      default:
        return null
    }
  }

  const bugFields = getBugFields()

  if (!bugFields) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div ref={modalRef} className="bg-notion-bg-secondary rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-semibold text-notion-text">{bugName} Bug Details</h3>
          <button
            onClick={onClose}
            className="text-notion-text-secondary hover:text-notion-text transition-colors"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block mb-2 font-medium text-notion-text">Posted about issues?</label>
            <div className="space-y-2">
              {POSTING_OPTIONS.map((option) => (
                <label key={option} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bugFields.postedAbout.includes(option)}
                    onChange={() => handleMultiSelect(bugFields.postedAboutKey, option)}
                    className="w-4 h-4 text-notion-accent focus:ring-notion-accent"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>

          {bugFields.methodUsedKey && (
            <FormField
              label="Method used to resolve"
              name={bugFields.methodUsedKey}
              type="text"
              value={bugFields.methodUsed}
              onChange={handleChange}
              placeholder="How did you resolve it?"
            />
          )}

          {bugFields.poiKey && (
            <FormField
              label="What POI?"
              name={bugFields.poiKey}
              type="text"
              value={bugFields.poi}
              onChange={handleChange}
              placeholder="Which point of interest?"
            />
          )}

          {bugFields.pictureKey && (
            <FormField
              label="Picture"
              name={bugFields.pictureKey}
              type="url"
              value={bugFields.picture}
              onChange={handleChange}
              placeholder="URL to screenshot/image"
            />
          )}

          <FormField
            label="Link to post"
            name={bugFields.linkToPostKey}
            type="url"
            value={bugFields.linkToPost}
            onChange={handleChange}
            placeholder="https://..."
          />

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name={bugFields.wasResolvedKey}
              checked={bugFields.wasResolved}
              onChange={handleChange}
              className="w-4 h-4 text-notion-accent focus:ring-notion-accent"
            />
            <span>Was it resolved?</span>
          </label>

          <div className="flex justify-end gap-4 pt-4 border-t border-notion-bg-tertiary">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-notion-bg-tertiary hover:bg-notion-bg-tertiary/80 text-notion-text rounded-lg transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BugDetailsModal

