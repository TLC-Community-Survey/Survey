import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Callout from '../Callout'

describe('Callout', () => {
  it('renders with default icon', () => {
    render(<Callout>Test message</Callout>)
    expect(screen.getByText('💡')).toBeInTheDocument()
    expect(screen.getByText('Test message')).toBeInTheDocument()
  })

  it('renders with custom icon', () => {
    render(<Callout icon="⚠️">Warning message</Callout>)
    expect(screen.getByText('⚠️')).toBeInTheDocument()
    expect(screen.getByText('Warning message')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(<Callout className="custom-class">Test</Callout>)
    expect(container.firstChild).toHaveClass('custom-class')
  })
})

