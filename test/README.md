# Testing Infrastructure

This directory contains the comprehensive testing infrastructure for the Senior Portfolio Platform.

## Overview

The testing setup includes:

- **Unit Tests** - Component and utility function testing with Vitest
- **Integration Tests** - Content validation and schema testing
- **End-to-End Tests** - Critical user flow testing with Playwright
- **Accessibility Tests** - WCAG compliance testing with axe-core
- **Performance Tests** - Lighthouse CI for performance monitoring

## Test Structure

```
test/
├── components/           # Component unit tests
│   ├── hero.test.tsx
│   ├── navigation.test.tsx
│   └── skills-matrix.test.tsx
├── accessibility.test.tsx    # Accessibility compliance tests
├── accessibility-utils.ts    # Accessibility testing utilities
├── content-validation.test.ts # Content schema validation tests
├── utils.test.ts            # Utility function tests
├── setup.ts                 # Test environment setup
├── test-runner.ts           # Infrastructure verification script
└── README.md               # This file

e2e/
├── homepage.spec.ts         # Homepage functionality tests
├── projects.spec.ts         # Project section tests
├── contact-form.spec.ts     # Contact form tests
└── accessibility.spec.ts    # E2E accessibility tests
```

## Available Scripts

### Unit Testing
```bash
npm run test              # Run tests in watch mode
npm run test:run          # Run tests once
npm run test:coverage     # Run tests with coverage report
npm run test:ui           # Run tests with UI interface
```

### Component Testing
```bash
npm run test:components   # Run component tests only
npm run test:utils        # Run utility tests only
npm run test:accessibility # Run accessibility tests only
```

### End-to-End Testing
```bash
npm run e2e               # Run E2E tests headless
npm run e2e:headed        # Run E2E tests with browser UI
npm run e2e:ui            # Run E2E tests with Playwright UI
npm run e2e:report        # Show E2E test report
```

### Performance Testing
```bash
npm run lighthouse        # Run Lighthouse CI
npm run lighthouse:collect # Collect Lighthouse data only
npm run lighthouse:assert  # Assert Lighthouse thresholds
```

### Infrastructure Testing
```bash
npm run test:infrastructure # Verify testing setup
npm run test:all           # Run all test suites
```

## Test Configuration

### Vitest Configuration
- **Environment**: jsdom for DOM testing
- **Coverage**: v8 provider with 80% thresholds
- **Setup**: Automatic cleanup and mocking
- **Globals**: Available without imports

### Playwright Configuration
- **Browsers**: Chromium, Firefox, WebKit
- **Mobile**: Pixel 5, iPhone 12 viewports
- **Base URL**: http://localhost:3000
- **Retries**: 2 on CI, 0 locally

### Lighthouse Configuration
- **Performance**: ≥95 score required
- **Accessibility**: 100 score required
- **Core Web Vitals**: LCP <2.5s, CLS <0.1, TBT <300ms
- **Best Practices**: ≥90 score required

## Writing Tests

### Component Tests
```typescript
import { render, screen } from '@testing-library/react';
import { MyComponent } from '@/components/my-component';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

### Accessibility Tests
```typescript
import { testAccessibility } from '../accessibility-utils';

it('should not have accessibility violations', async () => {
  await testAccessibility(<MyComponent />);
});
```

### E2E Tests
```typescript
import { test, expect } from '@playwright/test';

test('should navigate correctly', async ({ page }) => {
  await page.goto('/');
  await page.click('a[href="#section"]');
  await expect(page.locator('#section')).toBeInViewport();
});
```

## Mocking Strategy

### Framer Motion
```typescript
vi.mock('framer-motion', () => ({
  motion: {
    div: 'div',
    button: 'button',
  },
  AnimatePresence: ({ children }) => children,
}));
```

### Next.js Components
```typescript
vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }) => <img src={src} alt={alt} {...props} />
}));
```

## Coverage Requirements

- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%
- **Statements**: 80%

## CI/CD Integration

Tests run automatically on:
- Pull requests to main
- Pushes to main/develop branches
- Manual workflow dispatch

### GitHub Actions Workflow
- **Unit Tests**: Run on all Node.js versions
- **E2E Tests**: Run on Ubuntu with Playwright
- **Lighthouse**: Performance regression detection
- **Accessibility**: WCAG compliance verification

## Troubleshooting

### Common Issues

1. **Tests timing out**
   - Increase timeout in test configuration
   - Check for infinite loops or unresolved promises

2. **Accessibility violations**
   - Use browser dev tools to inspect elements
   - Check ARIA attributes and semantic HTML

3. **E2E tests flaky**
   - Add explicit waits for elements
   - Use `page.waitForLoadState()` for navigation

4. **Coverage too low**
   - Add tests for uncovered branches
   - Remove excluded files from coverage config

### Debug Commands
```bash
npm run test:ui          # Visual test debugging
npm run e2e:headed       # Visual E2E debugging
npm run test:coverage    # Coverage analysis
```

## Best Practices

1. **Test Structure**: Follow AAA pattern (Arrange, Act, Assert)
2. **Accessibility**: Test with screen readers and keyboard navigation
3. **Performance**: Monitor Core Web Vitals in tests
4. **Mocking**: Mock external dependencies and animations
5. **Coverage**: Aim for meaningful tests, not just coverage numbers

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Library Documentation](https://testing-library.com/)
- [axe-core Documentation](https://github.com/dequelabs/axe-core)
- [Lighthouse CI Documentation](https://github.com/GoogleChrome/lighthouse-ci)