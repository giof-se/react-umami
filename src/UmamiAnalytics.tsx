// src/UmamiAnalytics.tsx

import { useEffect } from 'react';
import './types';
import type { UmamiEventData } from './types';

interface UmamiAnalyticsProps {
  websiteId?: string;
  src?: string;
  /**
   * Restricts tracking to specific domains
   * @example ['example.com', 'www.example.com']
   */
  domains?: string[];
  /**
   * Whether to automatically track page views
   * @default true
   */
  autoTrack?: boolean;
  /**
   * Enable dry run mode for testing (no real events sent to Umami)
   * @default false
   */
  dryRun?: boolean;
  /**
   * Enable debug logging to console
   * @default false
   */
  debug?: boolean;
}

export const UmamiAnalytics = ({
  websiteId,
  src,
  domains,
  autoTrack = true,
  dryRun = false,
  debug = false,
}: UmamiAnalyticsProps) => {
  const finalWebsiteId =
    websiteId ??
    process.env.UMAMI_WEBSITE_ID ??
    process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID ??
    process.env.REACT_APP_UMAMI_WEBSITE_ID;

  const finalSrc =
    src ??
    process.env.UMAMI_SCRIPT_URL ??
    process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL ??
    process.env.REACT_APP_UMAMI_SCRIPT_URL ??
    'https://cloud.umami.is/script.js';

  // biome-ignore lint/correctness/useExhaustiveDependencies: Analytics script should only be injected once on mount, not re-injected when props change
  useEffect(() => {
    // SSR safety
    if (typeof window === 'undefined') return;

    // Must have website ID
    if (!finalWebsiteId) {
      console.warn('UmamiAnalytics: No websiteId provided.');
      return;
    }

    if (debug) {
      console.log('UmamiAnalytics: Initializing with config:', {
        websiteId: finalWebsiteId,
        src: finalSrc,
        domains,
        autoTrack,
        dryRun,
        debug,
      });
    }

    // Dry run mode
    if (dryRun) {
      if (debug) {
        console.log('UmamiAnalytics: Dry run mode enabled - no script will be loaded');
      }

      if (!window.umami) {
        window.umami = {
          track: (eventName: string, eventData?: UmamiEventData) => {
            console.log('UmamiAnalytics [DRY RUN]: Would track event:', eventName, eventData);
          },
        };
      }
      return;
    }

    // Skip if script already exists
    if (document.querySelector(`script[src="${finalSrc}"]`)) {
      if (debug) {
        console.log('UmamiAnalytics: Script already exists, skipping injection');
      }
      return;
    }

    if (debug) {
      console.log('UmamiAnalytics: Injecting script into document head');
    }

    // Create and inject script
    const script = document.createElement('script');
    script.src = finalSrc;
    script.async = true;
    script.defer = true;
    script.setAttribute('data-website-id', finalWebsiteId);

    if (domains?.length) {
      script.setAttribute('data-domains', domains.join(','));
    }

    if (!autoTrack) {
      script.setAttribute('data-auto-track', 'false');
    }

    // Add debug event listeners
    if (debug) {
      script.onload = () => {
        console.log('UmamiAnalytics: Script loaded successfully');
      };
      script.onerror = (error) => {
        console.error('UmamiAnalytics: Script failed to load', error);
      };
    }

    document.head.appendChild(script);
  }, []); // INTENTIONALLY EMPTY - Only run once on mount

  return null;
};
