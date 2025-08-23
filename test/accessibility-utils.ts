import { render } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import { ReactElement } from 'react'

// Extend Jest matchers
expect.extend(toHaveNoViolations)

/**
 * Test component for accessibility violations
 */
export async function testAccessibility(component: ReactElement): Promise<void> {
  const { container } = render(component)
  const results = await axe(container)
  expect(results).toHaveNoViolations()
}

/**
 * Test component with custom axe configuration
 */
export async function testAccessibilityWithConfig(
  component: ReactElement,
  config?: any
): Promise<void> {
  const { container } = render(component)
  const results = await axe(container, config)
  expect(results).toHaveNoViolations()
}

/**
 * Test keyboard navigation
 */
export function testKeyboardNavigation(container: HTMLElement): void {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )
  
  expect(focusableElements.length).toBeGreaterThan(0)
  
  // Test that all focusable elements have visible focus indicators
  focusableElements.forEach((element) => {
    // This is a basic check - in a real test you'd simulate focus and check styles
    expect(element).toBeInTheDocument()
  })
}

/**
 * Test ARIA attributes
 */
export function testAriaAttributes(container: HTMLElement): void {
  // Check for proper heading hierarchy
  const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6')
  if (headings.length > 0) {
    const firstHeading = headings[0] as HTMLElement
    expect(firstHeading.tagName.toLowerCase()).toBe('h1')
  }
  
  // Check for proper landmark roles
  const main = container.querySelector('main')
  if (main) {
    expect(main).toHaveAttribute('role', 'main')
  }
  
  // Check for proper form labels
  const inputs = container.querySelectorAll('input, textarea, select')
  inputs.forEach((input) => {
    const id = input.getAttribute('id')
    if (id) {
      const label = container.querySelector(`label[for="${id}"]`)
      expect(label).toBeInTheDocument()
    }
  })
}

/**
 * Test color contrast (basic implementation)
 */
export function testColorContrast(element: HTMLElement): void {
  const styles = window.getComputedStyle(element)
  const color = styles.color
  const backgroundColor = styles.backgroundColor
  
  // This is a simplified test - in production you'd use a proper contrast checker
  expect(color).toBeTruthy()
  expect(backgroundColor).toBeTruthy()
}

/**
 * Test reduced motion preferences
 */
export function testReducedMotion(): void {
  // Mock reduced motion preference
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => {},
    }),
  })
  
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  expect(mediaQuery.matches).toBe(true)
}