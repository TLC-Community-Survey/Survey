import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import FormField from '../FormField'

describe('FormField', () => {
  it('renders text input', () => {
    render(
      <FormField
        label="Test Field"
        name="test"
        type="text"
        value=""
        onChange={() => {}}
      />
    )
    expect(screen.getByLabelText('Test Field')).toBeInTheDocument()
    expect(screen.getByLabelText('Test Field')).toHaveAttribute('type', 'text')
  })

  it('shows required indicator', () => {
    render(
      <FormField
        label="Required Field"
        name="test"
        required
        value=""
        onChange={() => {}}
      />
    )
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('shows error message', () => {
    render(
      <FormField
        label="Test Field"
        name="test"
        value=""
        onChange={() => {}}
        error="This field is required"
      />
    )
    expect(screen.getByText('This field is required')).toBeInTheDocument()
  })

  it('calls onChange when input changes', async () => {
    const handleChange = vi.fn()
    const user = userEvent.setup()
    
    render(
      <FormField
        label="Test Field"
        name="test"
        value=""
        onChange={handleChange}
      />
    )
    
    const input = screen.getByLabelText('Test Field')
    await user.type(input, 'test value')
    
    expect(handleChange).toHaveBeenCalled()
  })

  it('renders textarea', () => {
    render(
      <FormField
        label="Textarea Field"
        name="test"
        type="textarea"
        value=""
        onChange={() => {}}
      />
    )
    expect(screen.getByLabelText('Textarea Field')).toBeInTheDocument()
    expect(screen.getByLabelText('Textarea Field').tagName).toBe('TEXTAREA')
  })

  it('renders select', () => {
    render(
      <FormField
        label="Select Field"
        name="test"
        type="select"
        value=""
        onChange={() => {}}
        options={[
          { value: '1', label: 'Option 1' },
          { value: '2', label: 'Option 2' },
        ]}
      />
    )
    expect(screen.getByLabelText('Select Field')).toBeInTheDocument()
    expect(screen.getByLabelText('Select Field').tagName).toBe('SELECT')
  })
})

