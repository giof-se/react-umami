// tests/UmamiAnalytics.test.tsx

import { render, screen } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UmamiAnalytics } from '../src/UmamiAnalytics';

// Mock next/script to avoid network requests in tests
vi.mock('next/script', () => {
  return {
    default: ({
      strategy,
      src,
      'data-website-id': websiteId,
      'data-domains': domains,
      'data-auto-track': autoTrack,
    }) => {
      return (
        <script
          data-testid="umami-script"
          // strategy prop is omitted as it doesn't exist on HTMLScriptElement
          src={src}
          data-website-id={websiteId}
          data-domains={domains}
          data-auto-track={autoTrack}
        />
      );
    },
  };
});

describe('UmamiAnalytics', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
    process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID = undefined;
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  it('renders null when no websiteId is provided', () => {
    const { container } = render(<UmamiAnalytics />);
    expect(container.firstChild).toBeNull();
    expect(console.warn).toHaveBeenCalledWith('UmamiAnalytics: No websiteId provided.');
  });

  it('renders script with custom websiteId', () => {
    const { getByTestId } = render(<UmamiAnalytics websiteId="test-id" />);

    const scriptElement = getByTestId('umami-script');
    expect(scriptElement).not.toBeNull();
    expect(scriptElement.getAttribute('src')).toBe('https://umami.marjala.com/script.js');
    expect(scriptElement.getAttribute('data-website-id')).toBe('test-id');
  });

  it('renders script with custom src', () => {
    const { getByTestId } = render(
      <UmamiAnalytics websiteId="test-id" src="https://custom-analytics.example.com/script.js" />,
    );

    const scriptElement = getByTestId('umami-script');
    expect(scriptElement).not.toBeNull();
    expect(scriptElement.getAttribute('src')).toBe(
      'https://custom-analytics.example.com/script.js',
    );
  });

  it('uses environment variable for websiteId if available', () => {
    process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID = 'env-test-id';

    const { getByTestId } = render(<UmamiAnalytics />);

    const scriptElement = getByTestId('umami-script');
    expect(scriptElement).not.toBeNull();
    expect(scriptElement.getAttribute('data-website-id')).toBe('env-test-id');
  });

  it('adds domain restrictions when domains prop is provided', () => {
    const { getByTestId } = render(
      <UmamiAnalytics websiteId="test-id" domains={['example.com', 'test.com']} />,
    );

    const scriptElement = getByTestId('umami-script');
    expect(scriptElement).not.toBeNull();
    expect(scriptElement.getAttribute('data-domains')).toBe('example.com,test.com');
  });

  it('disables auto-tracking when autoTrack is false', () => {
    const { getByTestId } = render(<UmamiAnalytics websiteId="test-id" autoTrack={false} />);

    const scriptElement = getByTestId('umami-script');
    expect(scriptElement).not.toBeNull();
    expect(scriptElement.getAttribute('data-auto-track')).toBe('false');
  });

  it('does not add data-auto-track when autoTrack is true (default)', () => {
    const { getByTestId } = render(<UmamiAnalytics websiteId="test-id" />);

    const scriptElement = getByTestId('umami-script');
    expect(scriptElement).not.toBeNull();
    expect(scriptElement.getAttribute('data-auto-track')).toBeNull();
  });
});
