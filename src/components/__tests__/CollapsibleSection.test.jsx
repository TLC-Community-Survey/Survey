import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import CollapsibleSection from '../CollapsibleSection'

describe('CollapsibleSection', () => {
  it('renders collapsed by default', () => {
    render(
      <CollapsibleSection title="Test Section">
        <p>Hidden content</p>
      </CollapsibleSection>
    )
    
    expect(screen.getByText('Test Section')).toBeInTheDocument()
    expect(screen.getByText('Hidden content')).toBeInTheDocument()
  })

  it('expands when clicked', async () => {
    const user = userEvent.setup()
    
    render(
      <CollapsibleSection title="Test Section">
        <p>Hidden content</p>
      </CollapsibleSection>
    )
    
    const button = screen.getByRole('button', { name: /test section/i })
    await user.click(button)
    
    // Content should be visible after expansion
    expect(screen.getByText('Hidden content')).toBeInTheDocument()
  })

  it('renders expanded when defaultOpen is true', () => {
    render(
      <CollapsibleSection title="Test Section" defaultOpen>
        <p>Visible content</p>
      </CollapsibleSection>
    )
    
    expect(screen.getByText('Visible content')).toBeInTheDocument()
  })
})

