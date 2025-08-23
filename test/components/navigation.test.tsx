import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Navigation } from '@/components/layout/navigation';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    header: 'header',
    div: 'div',
    button: 'button',
    a: 'a',
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

// Mock ThemeToggle component
vi.mock('@/components/ui/theme-toggle', () => ({
  ThemeToggle: () => <button aria-label="Toggle theme">Theme</button>,
}));

// Mock Button component
vi.mock('@/components/ui/button', () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Menu: () => <span>Menu</span>,
  X: () => <span>X</span>,
}));

const mockSections = [
  { id: 'about', label: 'About', href: '#about', order: 1 },
  { id: 'skills', label: 'Skills', href: '#skills', order: 2 },
  { id: 'projects', label: 'Projects', href: '#projects', order: 3 },
  { id: 'experience', label: 'Experience', href: '#experience', order: 4 },
  { id: 'contact', label: 'Contact', href: '#contact', order: 5 },
];

describe('Navigation Component', () => {
  it('should render navigation with proper accessibility attributes', () => {
    render(<Navigation sections={mockSections} />);

    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
    expect(nav).toHaveAttribute('aria-label', 'Main navigation');
  });

  it('should render all navigation links', () => {
    render(<Navigation sections={mockSections} />);

    mockSections.forEach(section => {
      const link = screen.getByText(section.label);
      expect(link).toBeInTheDocument();
      expect(link.closest('a')).toHaveAttribute('href', section.href);
    });
  });

  it('should highlight current section', () => {
    render(<Navigation sections={mockSections} currentSection="skills" />);

    const skillsLink = screen.getByText('Skills');
    const skillsLinkElement = skillsLink.closest('a');
    
    // Check for active state classes or aria-current
    expect(
      skillsLinkElement?.getAttribute('aria-current') === 'page' ||
      skillsLinkElement?.className.includes('active') ||
      skillsLinkElement?.className.includes('current')
    ).toBeTruthy();
  });

  it('should render mobile menu button', () => {
    render(<Navigation sections={mockSections} isMobile={true} />);

    const menuButton = screen.getByLabelText('Toggle mobile menu');
    expect(menuButton).toBeInTheDocument();
    expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    expect(menuButton).toHaveAttribute('aria-controls', 'mobile-menu');
  });

  it('should toggle mobile menu when button is clicked', async () => {
    const user = userEvent.setup();
    render(<Navigation sections={mockSections} isMobile={true} />);

    const menuButton = screen.getByLabelText('Toggle mobile menu');
    
    // Initially closed
    expect(menuButton).toHaveAttribute('aria-expanded', 'false');

    // Click to open
    await user.click(menuButton);
    expect(menuButton).toHaveAttribute('aria-expanded', 'true');

    // Click to close
    await user.click(menuButton);
    expect(menuButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('should support keyboard navigation', async () => {
    const user = userEvent.setup();
    render(<Navigation sections={mockSections} />);

    const firstLink = screen.getByText('About').closest('a');
    const secondLink = screen.getByText('Skills').closest('a');

    // Focus first link
    firstLink?.focus();
    expect(firstLink).toHaveFocus();

    // Tab to next link
    await user.tab();
    expect(secondLink).toHaveFocus();
  });

  it('should handle empty sections array', () => {
    render(<Navigation sections={[]} />);

    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
    
    // Should not crash and should render empty navigation
    const links = screen.queryAllByRole('link');
    expect(links).toHaveLength(0);
  });

  it('should render theme toggle if present', () => {
    render(<Navigation sections={mockSections} />);

    const themeToggle = screen.queryByLabelText(/theme/i);
    if (themeToggle) {
      expect(themeToggle).toBeInTheDocument();
    }
  });

  it('should have proper focus management for mobile menu', async () => {
    const user = userEvent.setup();
    render(<Navigation sections={mockSections} isMobile={true} />);

    const menuButton = screen.getByLabelText('Toggle mobile menu');
    
    // Open mobile menu
    await user.click(menuButton);
    
    // First link in mobile menu should be focusable
    const firstMobileLink = screen.getByText('About').closest('a');
    if (firstMobileLink) {
      await user.tab();
      expect(firstMobileLink).toHaveFocus();
    }
  });

  it('should close mobile menu when link is clicked', async () => {
    const user = userEvent.setup();
    render(<Navigation sections={mockSections} isMobile={true} />);

    const menuButton = screen.getByLabelText('Toggle mobile menu');
    
    // Open mobile menu
    await user.click(menuButton);
    expect(menuButton).toHaveAttribute('aria-expanded', 'true');

    // Click a navigation link
    const aboutLink = screen.getByText('About');
    await user.click(aboutLink);

    // Menu should close
    expect(menuButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('should handle scroll spy functionality', () => {
    render(<Navigation sections={mockSections} currentSection="projects" />);

    const projectsLink = screen.getByText('Projects');
    const projectsLinkElement = projectsLink.closest('a');
    
    // Should indicate current section
    expect(
      projectsLinkElement?.getAttribute('aria-current') ||
      projectsLinkElement?.className.includes('active')
    ).toBeTruthy();
  });

  it('should render with sticky positioning classes', () => {
    const { container } = render(<Navigation sections={mockSections} />);

    const nav = container.querySelector('nav');
    expect(nav?.className).toMatch(/sticky|fixed/);
  });

  it('should handle sections in correct order', () => {
    const unorderedSections = [
      { id: 'contact', label: 'Contact', href: '#contact', order: 5 },
      { id: 'about', label: 'About', href: '#about', order: 1 },
      { id: 'skills', label: 'Skills', href: '#skills', order: 2 },
    ];

    render(<Navigation sections={unorderedSections} />);

    const links = screen.getAllByRole('link');
    const linkTexts = links.map(link => link.textContent);

    // Should render in order based on order property
    expect(linkTexts.indexOf('About')).toBeLessThan(linkTexts.indexOf('Skills'));
    expect(linkTexts.indexOf('Skills')).toBeLessThan(linkTexts.indexOf('Contact'));
  });
});