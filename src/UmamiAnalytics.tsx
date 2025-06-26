// src/UmamiAnalytics.tsx

import React, { useEffect } from 'react';
import './types';

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
  const finalSrc = src ?? 'https://cloud.umami.is/script.js';

  useEffect(() => {
    // SSR safety check - ensure we're in a browser environment
    if (typeof window === 'undefined') {
      if (debug) {
        console.log('UmamiAnalytics: SSR detected, skipping script injection');
      }
      return;
    }

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

    // Handle dry run mode
    if (dryRun) {
      if (debug) {
        console.log('UmamiAnalytics: Dry run mode enabled - no script will be loaded');
      }
      
      // Create mock umami object for testing
      if (!window.umami) {
        window.umami = {
          track: (eventName: string, eventData?: Record<string, any>) => {
            console.log('UmamiAnalytics [DRY RUN]: Would track event:', eventName, eventData);
          },
        };
      }
      return;
    }

    // Check if script already exists
    const existingScript = document.querySelector(`script[src="${finalSrc}"]`);
    if (existingScript) {
      if (debug) {
        console.log('UmamiAnalytics: Script already exists, skipping injection');
      }
      return;
    }

    if (debug) {
      console.log('UmamiAnalytics: Injecting script into document head');
    }

    // Create and configure script element
    const script = document.createElement('script');
    script.src = finalSrc;
    script.async = true;
    script.defer = true;
    script.setAttribute('data-website-id', finalWebsiteId);

    if (domains && domains.length > 0) {
      script.setAttribute('data-domains', domains.join(','));
    }

    if (autoTrack === false) {
      script.setAttribute('data-auto-track', 'false');
    }

    // Add load event listener for debugging
    if (debug) {
      script.onload = () => {
        console.log('UmamiAnalytics: Script loaded successfully');
      };
      script.onerror = (error) => {
        console.error('UmamiAnalytics: Script failed to load', error);
      };
    }

    // Append script to document head
    document.head.appendChild(script);

    // Cleanup function to remove script on unmount
    return () => {
      const scriptToRemove = document.querySelector(`script[src="${finalSrc}"]`);
      if (scriptToRemove) {
        if (debug) {
          console.log('UmamiAnalytics: Cleaning up script on unmount');
        }
        scriptToRemove.remove();
      }
    };
  }, [finalWebsiteId, finalSrc, domains, autoTrack, dryRun, debug]);

  // Return null as this component doesn't render any visible content
  return null;
};
