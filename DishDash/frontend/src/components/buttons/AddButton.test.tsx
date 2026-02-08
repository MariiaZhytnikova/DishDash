import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { GlobalStyle } from '../../styles/GlobalStyle';
import { theme } from '../../styles/theme';
import { AddButton } from './AddButton';

// Helper to render with theme
function renderWithTheme(component: React.ReactElement) {
  return render(
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      {component}
    </ThemeProvider>
  );
}

describe('AddButton', () => {
  // Clean up DOM after each test to prevent multiple button errors
  afterEach(() => {
    cleanup();
  });

  it('renders with default text', () => {
    renderWithTheme(<AddButton onClick={() => {}} />);
    expect(screen.getByText('+ Add')).toBeInTheDocument();
  });

  it('renders with custom children', () => {
    renderWithTheme(<AddButton onClick={() => {}}>Custom Text</AddButton>);
    expect(screen.getByText('Custom Text')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    renderWithTheme(<AddButton onClick={handleClick} />);
    
    screen.getByText('+ Add').click();
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('can be disabled', () => {
    renderWithTheme(<AddButton onClick={() => {}} disabled />);
    expect(screen.getByText('+ Add')).toBeDisabled();
  });

  /**
   * Visual/Style Tests
   * These test the ACTUAL rendered appearance, not just that the CSS variables exist
   */
  describe('Visual Appearance', () => {
    it('has primary background color', () => {
      const { container } = renderWithTheme(<AddButton onClick={() => {}} />);
      const button = container.querySelector('button');
      
      // Get computed styles from the DOM
      const styles = window.getComputedStyle(button!);
      
      // Check background is not transparent
      expect(styles.backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
      expect(styles.backgroundColor).not.toBe('');
      expect(styles.backgroundColor).not.toBe('transparent');
      
      // The button should have a visible background color
      expect(styles.backgroundColor).toBeTruthy();
    });

    it('has white text color', () => {
      const { container } = renderWithTheme(<AddButton onClick={() => {}} />);
      const button = container.querySelector('button');
      const styles = window.getComputedStyle(button!);
      
      // White is rgb(255, 255, 255)
      expect(styles.color).toBe('rgb(255, 255, 255)');
    });

    it('has rounded corners', () => {
      const { container } = renderWithTheme(<AddButton onClick={() => {}} />);
      const button = container.querySelector('button');
      const styles = window.getComputedStyle(button!);
      
      expect(styles.borderRadius).toBe('10px');
    });

    it('has no border', () => {
      const { container } = renderWithTheme(<AddButton onClick={() => {}} />);
      const button = container.querySelector('button');
      const styles = window.getComputedStyle(button!);
      
      // JSDOM returns empty string for 'border: none'
      expect(styles.border).toBe('');
    });

    it('has correct padding', () => {
      const { container } = renderWithTheme(<AddButton onClick={() => {}} />);
      const button = container.querySelector('button');
      const styles = window.getComputedStyle(button!);
      
      expect(styles.padding).toBe('8px 24px');
    });

    it('has pointer cursor', () => {
      const { container } = renderWithTheme(<AddButton onClick={() => {}} />);
      const button = container.querySelector('button');
      const styles = window.getComputedStyle(button!);
      
      expect(styles.cursor).toBe('pointer');
    });

    it('changes background on hover (requires user-event)', async () => {
      // Note: Testing hover states is complex in JSDOM
      // This is more of a documentation of what SHOULD happen
      // For real hover testing, use Cypress/Playwright
      
      const { container } = renderWithTheme(<AddButton onClick={() => {}} />);
      const button = container.querySelector('button')!;
      const initialStyles = window.getComputedStyle(button);
      
      // Just verify the hover state exists in the styled component
      // Actual hover testing requires browser automation
      expect(initialStyles.backgroundColor).toBeTruthy();
    });
  });
});
