// tests/UmamiAnalytics.test.tsx

import { render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { UmamiBeforeSend } from '../src/types';
import { UMAMI_BEFORE_SEND_GLOBAL, UmamiAnalytics } from '../src/UmamiAnalytics';

const getBeforeSendGlobal = () =>
  (window as unknown as Record<string, unknown>)[UMAMI_BEFORE_SEND_GLOBAL] as
    | UmamiBeforeSend
    | undefined;

describe('UmamiAnalytics', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
    process.env.UMAMI_WEBSITE_ID = undefined;
    process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID = undefined;
    process.env.REACT_APP_UMAMI_WEBSITE_ID = undefined;
    process.env.UMAMI_SCRIPT_URL = undefined;
    process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL = undefined;
    process.env.REACT_APP_UMAMI_SCRIPT_URL = undefined;
    process.env.UMAMI_TAG = undefined;
    process.env.NEXT_PUBLIC_UMAMI_TAG = undefined;
    process.env.REACT_APP_UMAMI_TAG = undefined;
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    // Clear any existing scripts and tracker globals from previous tests
    document.head.innerHTML = '';
    window.umami = undefined;
    (window as unknown as Record<string, unknown>)[UMAMI_BEFORE_SEND_GLOBAL] = undefined;
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

  it('adds a tag when the tag prop is provided', () => {
    render(<UmamiAnalytics websiteId="test-id" tag="marketing-site" />);

    const scriptElement = document.querySelector('script[src="https://cloud.umami.is/script.js"]');
    expect(scriptElement).not.toBeNull();
    expect(scriptElement?.getAttribute('data-tag')).toBe('marketing-site');
  });

  it('does not add data-tag when no tag is provided', () => {
    render(<UmamiAnalytics websiteId="test-id" />);

    const scriptElement = document.querySelector('script[src="https://cloud.umami.is/script.js"]');
    expect(scriptElement).not.toBeNull();
    expect(scriptElement?.getAttribute('data-tag')).toBeNull();
  });

  it('uses UMAMI_TAG environment variable with highest priority', () => {
    process.env.UMAMI_TAG = 'universal-tag';
    process.env.NEXT_PUBLIC_UMAMI_TAG = 'next-tag';
    process.env.REACT_APP_UMAMI_TAG = 'cra-tag';

    render(<UmamiAnalytics websiteId="test-id" />);

    const scriptElement = document.querySelector('script[src="https://cloud.umami.is/script.js"]');
    expect(scriptElement).not.toBeNull();
    expect(scriptElement?.getAttribute('data-tag')).toBe('universal-tag');
  });

  it('falls back to NEXT_PUBLIC_UMAMI_TAG when UMAMI_TAG is not set', () => {
    process.env.NEXT_PUBLIC_UMAMI_TAG = 'next-tag';
    process.env.REACT_APP_UMAMI_TAG = 'cra-tag';

    render(<UmamiAnalytics websiteId="test-id" />);

    const scriptElement = document.querySelector('script[src="https://cloud.umami.is/script.js"]');
    expect(scriptElement).not.toBeNull();
    expect(scriptElement?.getAttribute('data-tag')).toBe('next-tag');
  });

  it('falls back to REACT_APP_UMAMI_TAG when others are not set', () => {
    process.env.REACT_APP_UMAMI_TAG = 'cra-tag';

    render(<UmamiAnalytics websiteId="test-id" />);

    const scriptElement = document.querySelector('script[src="https://cloud.umami.is/script.js"]');
    expect(scriptElement).not.toBeNull();
    expect(scriptElement?.getAttribute('data-tag')).toBe('cra-tag');
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
    expect(consoleSpy).toHaveBeenCalledWith(
      'UmamiAnalytics: Dry run mode enabled - no script will be loaded',
    );

    // Should create mock umami object
    expect(window.umami).toBeDefined();
    expect(typeof window.umami?.track).toBe('function');

    consoleSpy.mockRestore();
  });

  it('enables debug logging when debug=true', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    render(<UmamiAnalytics websiteId="test-id" debug={true} />);

    // Should log initialization config
    expect(consoleSpy).toHaveBeenCalledWith(
      'UmamiAnalytics: Initializing with config:',
      expect.objectContaining({
        websiteId: 'test-id',
        debug: true,
      }),
    );

    consoleSpy.mockRestore();
  });

  it('handles missing debug props gracefully', () => {
    // Test that component works without debug or dryRun props
    render(<UmamiAnalytics websiteId="test-id" />);

    const scriptElement = document.querySelector('script[src="https://cloud.umami.is/script.js"]');
    expect(scriptElement).not.toBeNull();
    expect(scriptElement?.getAttribute('data-website-id')).toBe('test-id');
  });

  it('uses UMAMI_SCRIPT_URL environment variable with highest priority', () => {
    process.env.UMAMI_WEBSITE_ID = 'test-id';
    process.env.UMAMI_SCRIPT_URL = 'https://analytics.example.com/script.js';
    process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL = 'https://next.example.com/script.js';
    process.env.REACT_APP_UMAMI_SCRIPT_URL = 'https://cra.example.com/script.js';

    render(<UmamiAnalytics />);

    const scriptElement = document.querySelector(
      'script[src="https://analytics.example.com/script.js"]',
    );
    expect(scriptElement).not.toBeNull();
    expect(scriptElement?.getAttribute('data-website-id')).toBe('test-id');
  });

  it('falls back to NEXT_PUBLIC_UMAMI_SCRIPT_URL when UMAMI_SCRIPT_URL is not set', () => {
    process.env.UMAMI_WEBSITE_ID = 'test-id';
    process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL = 'https://next.example.com/script.js';
    process.env.REACT_APP_UMAMI_SCRIPT_URL = 'https://cra.example.com/script.js';

    render(<UmamiAnalytics />);

    const scriptElement = document.querySelector(
      'script[src="https://next.example.com/script.js"]',
    );
    expect(scriptElement).not.toBeNull();
    expect(scriptElement?.getAttribute('data-website-id')).toBe('test-id');
  });

  it('falls back to REACT_APP_UMAMI_SCRIPT_URL when others are not set', () => {
    process.env.UMAMI_WEBSITE_ID = 'test-id';
    process.env.REACT_APP_UMAMI_SCRIPT_URL = 'https://cra.example.com/script.js';

    render(<UmamiAnalytics />);

    const scriptElement = document.querySelector('script[src="https://cra.example.com/script.js"]');
    expect(scriptElement).not.toBeNull();
    expect(scriptElement?.getAttribute('data-website-id')).toBe('test-id');
  });

  it('falls back to default script URL when no environment variables are set', () => {
    process.env.UMAMI_WEBSITE_ID = 'test-id';

    render(<UmamiAnalytics />);

    const scriptElement = document.querySelector('script[src="https://cloud.umami.is/script.js"]');
    expect(scriptElement).not.toBeNull();
    expect(scriptElement?.getAttribute('data-website-id')).toBe('test-id');
  });

  it('passes tracker options through as data attributes', () => {
    render(
      <UmamiAnalytics
        websiteId="test-id"
        autoPageview={false}
        performance={true}
        hostUrl="https://collect.example.com"
        tag="variant-b"
        excludeSearch={true}
        excludeHash={true}
        doNotTrack={true}
        distinctId="user-123"
        fetchCredentials="include"
      />,
    );

    const scriptElement = document.querySelector('script[src="https://cloud.umami.is/script.js"]');
    expect(scriptElement?.getAttribute('data-auto-pageview')).toBe('false');
    expect(scriptElement?.getAttribute('data-performance')).toBe('true');
    expect(scriptElement?.getAttribute('data-host-url')).toBe('https://collect.example.com');
    expect(scriptElement?.getAttribute('data-tag')).toBe('variant-b');
    expect(scriptElement?.getAttribute('data-exclude-search')).toBe('true');
    expect(scriptElement?.getAttribute('data-exclude-hash')).toBe('true');
    expect(scriptElement?.getAttribute('data-do-not-track')).toBe('true');
    expect(scriptElement?.getAttribute('data-distinct-id')).toBe('user-123');
    expect(scriptElement?.getAttribute('data-fetch-credentials')).toBe('include');
  });

  it('does not add tracker option attributes by default', () => {
    render(<UmamiAnalytics websiteId="test-id" />);

    const scriptElement = document.querySelector('script[src="https://cloud.umami.is/script.js"]');
    for (const name of [
      'data-auto-pageview',
      'data-performance',
      'data-before-send',
      'data-host-url',
      'data-tag',
      'data-exclude-search',
      'data-exclude-hash',
      'data-do-not-track',
      'data-distinct-id',
      'data-fetch-credentials',
    ]) {
      expect(scriptElement?.getAttribute(name)).toBeNull();
    }
    expect(getBeforeSendGlobal()).toBeUndefined();
  });

  it('registers beforeSend as a global and points data-before-send at it', () => {
    const beforeSend = vi.fn((_type: string, payload: Record<string, unknown>) => ({
      ...payload,
      url: '/redacted',
    }));

    render(<UmamiAnalytics websiteId="test-id" beforeSend={beforeSend} />);

    const scriptElement = document.querySelector('script[src="https://cloud.umami.is/script.js"]');
    expect(scriptElement?.getAttribute('data-before-send')).toBe(UMAMI_BEFORE_SEND_GLOBAL);

    const result = getBeforeSendGlobal()?.('event', { url: '/secret?token=1' });
    expect(beforeSend).toHaveBeenCalledWith('event', { url: '/secret?token=1' });
    expect(result).toEqual({ url: '/redacted' });
  });

  it('calls the latest beforeSend after a rerender', () => {
    const first = vi.fn(() => null);
    const second = vi.fn((_type: string, payload: Record<string, unknown>) => payload);

    const { rerender } = render(<UmamiAnalytics websiteId="test-id" beforeSend={first} />);
    rerender(<UmamiAnalytics websiteId="test-id" beforeSend={second} />);

    getBeforeSendGlobal()?.('event', { name: 'signup' });
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledWith('event', { name: 'signup' });
  });

  it('replaces a stale beforeSend when remounted with an existing script', () => {
    const first = vi.fn(() => null);
    const second = vi.fn((_type: string, payload: Record<string, unknown>) => payload);

    const { unmount } = render(<UmamiAnalytics websiteId="test-id" beforeSend={first} />);
    unmount();
    render(<UmamiAnalytics websiteId="test-id" beforeSend={second} />);

    getBeforeSendGlobal()?.('event', { name: 'signup' });
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledWith('event', { name: 'signup' });
  });

  it('runs beforeSend in dry run mode and logs the payload it returns', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const beforeSend = vi.fn(async (_type: string, payload: Record<string, unknown>) => ({
      ...payload,
      data: { plan: 'pro' },
    }));

    render(<UmamiAnalytics websiteId="test-id" dryRun={true} beforeSend={beforeSend} />);
    window.umami?.track('signup', { plan: 'free' });

    expect(beforeSend).toHaveBeenCalledWith('event', {
      website: 'test-id',
      name: 'signup',
      data: { plan: 'free' },
    });
    await vi.waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('UmamiAnalytics [DRY RUN]: Would send:', 'event', {
        website: 'test-id',
        name: 'signup',
        data: { plan: 'pro' },
      });
    });
  });

  it('logs dropped payloads when beforeSend returns a falsy value in dry run mode', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    render(<UmamiAnalytics websiteId="test-id" dryRun={true} beforeSend={() => null} />);
    window.umami?.identify('user-123');

    await vi.waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        'UmamiAnalytics [DRY RUN]: beforeSend dropped:',
        'identify',
        { website: 'test-id', id: 'user-123', data: undefined },
      );
    });
    expect(consoleSpy).not.toHaveBeenCalledWith(
      'UmamiAnalytics [DRY RUN]: Would identify user:',
      'user-123',
      undefined,
    );
  });
});
