// src/UmamiAnalytics.tsx

import { useEffect, useRef } from 'react';
import type {
  UmamiBeforeSend,
  UmamiCustomEventFunction,
  UmamiEventData,
  UmamiPayload,
  UmamiTrackedProperties,
} from './types';

/**
 * Global the `beforeSend` prop is registered under. The tracker's `data-before-send`
 * attribute takes the name of a function on `window`, not a function.
 */
export const UMAMI_BEFORE_SEND_GLOBAL = '__umamiBeforeSend';

export interface UmamiAnalyticsProps {
  websiteId?: string;
  src?: string;
  /**
   * Restricts tracking to specific domains
   * @example ['example.com', 'www.example.com']
   */
  domains?: string[];
  /**
   * Tags all events collected by this script, so multiple properties can share
   * a single website ID and still be reported separately
   * @example 'marketing-site'
   */
  tag?: string;
  /**
   * Whether to automatically track page views and `data-umami-event` clicks
   * @default true
   */
  autoTrack?: boolean;
  /**
   * Whether to send the initial page view on load. Set to false to keep auto-tracking of
   * route changes and clicks but send the first page view yourself.
   * @default true
   */
  autoPageview?: boolean;
  /**
   * Collect Core Web Vitals (TTFB, FCP, LCP, CLS, INP) as `performance` payloads.
   * Requires an Umami version whose tracker supports `data-performance`.
   * @default false
   */
  performance?: boolean;
  /**
   * Called before every payload is sent. Return the (optionally modified) payload to send
   * it, or a falsy value to drop it. Must be set on first render; the latest function
   * passed is always the one called.
   */
  beforeSend?: UmamiBeforeSend;
  /**
   * Send data to a different Umami host than the one serving the script
   * @example 'https://analytics.example.com'
   */
  hostUrl?: string;
  /**
   * Strip the query string from tracked URLs
   * @default false
   */
  excludeSearch?: boolean;
  /**
   * Strip the hash from tracked URLs
   * @default false
   */
  excludeHash?: boolean;
  /**
   * Don't track visitors whose browser sends Do Not Track
   * @default false
   */
  doNotTrack?: boolean;
  /**
   * Distinct ID to identify the visitor with as soon as the tracker loads
   */
  distinctId?: string;
  /**
   * `credentials` mode for the tracker's collect requests
   * @default 'omit'
   */
  fetchCredentials?: RequestCredentials;
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
  tag,
  autoTrack = true,
  autoPageview = true,
  performance = false,
  beforeSend,
  hostUrl,
  excludeSearch = false,
  excludeHash = false,
  doNotTrack = false,
  distinctId,
  fetchCredentials,
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

  const finalTag =
    tag ??
    process.env.UMAMI_TAG ??
    process.env.NEXT_PUBLIC_UMAMI_TAG ??
    process.env.REACT_APP_UMAMI_TAG;

  // The tracker calls the registered global on every send, so it reads the latest callback
  // from this ref instead of the one captured when the script was injected
  const beforeSendRef = useRef(beforeSend);
  useEffect(() => {
    beforeSendRef.current = beforeSend;
  }, [beforeSend]);

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
        tag: finalTag,
        autoTrack,
        autoPageview,
        performance,
        beforeSend: !!beforeSend,
        hostUrl,
        excludeSearch,
        excludeHash,
        doNotTrack,
        distinctId,
        fetchCredentials,
        dryRun,
        debug,
      });
    }

    // Registered before the duplicate-script check so a remount replaces the stale callback
    if (beforeSend) {
      const beforeSendGlobal: UmamiBeforeSend = (type, payload) =>
        beforeSendRef.current ? beforeSendRef.current(type, payload) : payload;
      (window as unknown as Record<string, unknown>)[UMAMI_BEFORE_SEND_GLOBAL] = beforeSendGlobal;
    }

    // Dry run mode
    if (dryRun) {
      if (debug) {
        console.log('UmamiAnalytics: Dry run mode enabled - no script will be loaded');
      }

      // Runs beforeSend like the real tracker would, then logs what would be sent
      const dryRunSend = (type: string, payload: UmamiPayload) => {
        const callback = beforeSendRef.current;
        if (!callback) return false;

        void Promise.resolve(callback(type, payload)).then((result) => {
          if (result) {
            console.log('UmamiAnalytics [DRY RUN]: Would send:', type, result);
          } else {
            console.log('UmamiAnalytics [DRY RUN]: beforeSend dropped:', type, payload);
          }
        });
        return true;
      };

      if (!window.umami) {
        window.umami = {
          track: (
            eventName?: string | UmamiTrackedProperties | UmamiCustomEventFunction,
            eventData?: UmamiEventData,
          ) => {
            const payload: UmamiPayload =
              typeof eventName === 'string'
                ? { website: finalWebsiteId, name: eventName, data: eventData }
                : { website: finalWebsiteId };
            if (dryRunSend('event', payload)) return;

            if (typeof eventName === 'function' || typeof eventName === 'object' || !eventName) {
              console.log('UmamiAnalytics [DRY RUN]: Would track page view:', eventName);
            }
            console.log('UmamiAnalytics [DRY RUN]: Would track event:', eventName, eventData);
          },
          identify: (idOrData: string | object, data?: object) => {
            const payload: UmamiPayload =
              typeof idOrData === 'string'
                ? { website: finalWebsiteId, id: idOrData, data }
                : { website: finalWebsiteId, data: idOrData };
            if (dryRunSend('identify', payload)) return;

            console.log('UmamiAnalytics [DRY RUN]: Would identify user:', idOrData, data);
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

    if (finalTag) {
      script.setAttribute('data-tag', finalTag);
    }

    if (!autoTrack) {
      script.setAttribute('data-auto-track', 'false');
    }

    if (!autoPageview) {
      script.setAttribute('data-auto-pageview', 'false');
    }

    if (performance) {
      script.setAttribute('data-performance', 'true');
    }

    if (beforeSend) {
      script.setAttribute('data-before-send', UMAMI_BEFORE_SEND_GLOBAL);
    }

    if (hostUrl) {
      script.setAttribute('data-host-url', hostUrl);
    }

    if (excludeSearch) {
      script.setAttribute('data-exclude-search', 'true');
    }

    if (excludeHash) {
      script.setAttribute('data-exclude-hash', 'true');
    }

    if (doNotTrack) {
      script.setAttribute('data-do-not-track', 'true');
    }

    if (distinctId) {
      script.setAttribute('data-distinct-id', distinctId);
    }

    if (fetchCredentials) {
      script.setAttribute('data-fetch-credentials', fetchCredentials);
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
