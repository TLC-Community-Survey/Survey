import { describe, it, expect, vi, beforeEach } from 'vitest'
import { submitSurvey } from '../api'

// Mock fetch globally
global.fetch = vi.fn()

describe('API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('submits survey successfully', async () => {
    const mockResponse = {
      success: true,
      id: 1,
      responseId: 'TLC-CU1-1',
    }

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    })

    const formData = {
      discordName: 'testuser',
      age: '25',
      tos: true,
    }

    const result = await submitSurvey(formData)

    expect(result).toEqual(mockResponse)
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/submit',
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
    )
  })

  it('handles API errors', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Validation failed' }),
    })

    const formData = {
      discordName: 'testuser',
      age: '25',
      tos: true,
    }

    await expect(submitSurvey(formData)).rejects.toThrow()
  })

  it('handles network errors', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'))

    const formData = {
      discordName: 'testuser',
      age: '25',
      tos: true,
    }

    await expect(submitSurvey(formData)).rejects.toThrow('Network error')
  })
})

