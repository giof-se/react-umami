// tests/UmamiAnalytics.test.tsx

import { render, screen } from '@testing-library/react';
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { UmamiAnalytics } from '../src/UmamiAnalytics';

describe('UmamiAnalytics', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
    process.env.UMAMI_WEBSITE_ID = undefined;
    process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID = undefined;
    process.env.REACT_APP_UMAMI_WEBSITE_ID = undefined;
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    // Clear any existing scripts from previous tests
    document.head.innerHTML = '';
  });

  afterEach(() => {
    // Clean up any scripts added during tests
    document.head.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('renders null and warns when no websiteId is provided', () => {
    const { container } = render(<UmamiAnalytics />);
    expect(container.firstChild).toBeNull();
    expect(console.warn).toHaveBeenCalledWith('UmamiAnalytics: No websiteId provided.');
  });

  it('injects script with custom websiteId', () => {
    render(<UmamiAnalytics websiteId="test-id" />);

    const scriptElement = document.querySelector('script[src="https://cloud.umami.is/script.js"]');
    expect(scriptElement).not.toBeNull();
    expect(scriptElement?.getAttribute('data-website-id')).toBe('test-id');
    expect(scriptElement?.getAttribute('async')).toBe('');
    expect(scriptElement?.getAttribute('defer')).toBe('');
  });

  it('injects script with custom src', () => {
    render(
      <UmamiAnalytics websiteId="test-id" src="https://custom-analytics.example.com/script.js" />,
    );

    const scriptElement = document.querySelector(
      'script[src="https://custom-analytics.example.com/script.js"]',
    );
    expect(scriptElement).not.toBeNull();
    expect(scriptElement?.getAttribute('data-website-id')).toBe('test-id');
  });

  it('uses UMAMI_WEBSITE_ID environment variable with highest priority', () => {
    process.env.UMAMI_WEBSITE_ID = 'universal-id';
    process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID = 'next-id';
    process.env.REACT_APP_UMAMI_WEBSITE_ID = 'cra-id';

    render(<UmamiAnalytics />);

    const scriptElement = document.querySelector('script[src="https://cloud.umami.is/script.js"]');
    expect(scriptElement).not.toBeNull();
    expect(scriptElement?.getAttribute('data-website-id')).toBe('universal-id');
  });

  it('falls back to NEXT_PUBLIC_UMAMI_WEBSITE_ID when UMAMI_WEBSITE_ID is not set', () => {
    process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID = 'next-id';
    process.env.REACT_APP_UMAMI_WEBSITE_ID = 'cra-id';

    render(<UmamiAnalytics />);

    const scriptElement = document.querySelector('script[src="https://cloud.umami.is/script.js"]');
    expect(scriptElement).not.toBeNull();
    expect(scriptElement?.getAttribute('data-website-id')).toBe('next-id');
  });

  it('falls back to REACT_APP_UMAMI_WEBSITE_ID when others are not set', () => {
    process.env.REACT_APP_UMAMI_WEBSITE_ID = 'cra-id';

    render(<UmamiAnalytics />);

    const scriptElement = document.querySelector('script[src="https://cloud.umami.is/script.js"]');
    expect(scriptElement).not.toBeNull();
    expect(scriptElement?.getAttribute('data-website-id')).toBe('cra-id');
  });

  it('adds domain restrictions when domains prop is provided', () => {
    render(<UmamiAnalytics websiteId="test-id" domains={['example.com', 'test.com']} />);

    const scriptElement = document.querySelector('script[src="https://cloud.umami.is/script.js"]');
    expect(scriptElement).not.toBeNull();
    expect(scriptElement?.getAttribute('data-domains')).toBe('example.com,test.com');
  });

  it('disables auto-tracking when autoTrack is false', () => {
    render(<UmamiAnalytics websiteId="test-id" autoTrack={false} />);

    const scriptElement = document.querySelector('script[src="https://cloud.umami.is/script.js"]');
    expect(scriptElement).not.toBeNull();
    expect(scriptElement?.getAttribute('data-auto-track')).toBe('false');
  });

  it('does not add data-auto-track when autoTrack is true (default)', () => {
    render(<UmamiAnalytics websiteId="test-id" />);

    const scriptElement = document.querySelector('script[src="https://cloud.umami.is/script.js"]');
    expect(scriptElement).not.toBeNull();
    expect(scriptElement?.getAttribute('data-auto-track')).toBeNull();
  });

  it('does not inject duplicate scripts', () => {
    const { rerender } = render(<UmamiAnalytics websiteId="test-id" />);

    // First render should create script
    let scripts = document.querySelectorAll('script[src="https://cloud.umami.is/script.js"]');
    expect(scripts.length).toBe(1);

    // Re-render should not create another script
    rerender(<UmamiAnalytics websiteId="test-id" />);
    scripts = document.querySelectorAll('script[src="https://cloud.umami.is/script.js"]');
    expect(scripts.length).toBe(1);
  });

  it('handles dry run mode correctly', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    
    render(<UmamiAnalytics websiteId="test-id" dryRun={true} debug={true} />);

    // Should not inject script in dry run mode
    const scriptElement = document.querySelector('script[src="https://cloud.umami.is/script.js"]');
    expect(scriptElement).toBeNull();

    // Should log dry run message
    expect(consoleSpy).toHaveBeenCalledWith('UmamiAnalytics: Dry run mode enabled - no script will be loaded');

    // Should create mock umami object
    expect(window.umami).toBeDefined();
    expect(typeof window.umami?.track).toBe('function');

    consoleSpy.mockRestore();
  });

  it('enables debug logging when debug=true', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    
    render(<UmamiAnalytics websiteId="test-id" debug={true} />);

    // Should log initialization config
    expect(consoleSpy).toHaveBeenCalledWith('UmamiAnalytics: Initializing with config:', expect.objectContaining({
      websiteId: 'test-id',
      debug: true,
    }));

    consoleSpy.mockRestore();
  });

  it('handles missing debug props gracefully', () => {
    // Test that component works without debug or dryRun props
    render(<UmamiAnalytics websiteId="test-id" />);

    const scriptElement = document.querySelector('script[src="https://cloud.umami.is/script.js"]');
    expect(scriptElement).not.toBeNull();
    expect(scriptElement?.getAttribute('data-website-id')).toBe('test-id');
  });
});
