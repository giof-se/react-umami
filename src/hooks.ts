// src/hooks.ts

import { useCallback, useRef } from 'react';
import type { UmamiEventData } from './types';
import { identify as identifyUser, isUmamiLoaded, trackEvent, trackPageView } from './utils';

export interface UmamiConfig {
  websiteId?: string;
  src?: string;
  domains?: string[];
  autoTrack?: boolean;
  dryRun?: boolean;
  debug?: boolean;
}

/**
 * Hook for tracking Umami events with enhanced functionality
 */
export const useUmami = () => {
  const configRef = useRef<UmamiConfig>({});

  /**
   * Update runtime configuration
   */
  const updateConfig = useCallback((config: Partial<UmamiConfig>) => {
    configRef.current = { ...configRef.current, ...config };
  }, []);

  /**
   * Track a custom event
   */
  const track = useCallback((eventName: string, eventData?: UmamiEventData) => {
    if (configRef.current.dryRun) {
      console.log('UmamiAnalytics [DRY RUN]: Would track event:', eventName, eventData);
      return;
    }

    if (configRef.current.debug) {
      console.log('UmamiAnalytics: Tracking event:', eventName, eventData);
    }

    trackEvent(eventName, eventData);
  }, []);

  /**
   * Track a page view
   */
  const trackPage = useCallback((path?: string, title?: string) => {
    if (configRef.current.dryRun) {
      console.log('UmamiAnalytics [DRY RUN]: Would track page view:', path, title);
      return;
    }

    if (configRef.current.debug) {
      console.log('UmamiAnalytics: Tracking page view:', path, title);
    }

    trackPageView(path, title);
  }, []);

  /**
   * Identify the user
   */
  const identify = useCallback((idOrData: string | object, data?: object) => {
    if (configRef.current.dryRun) {
      console.log('UmamiAnalytics [DRY RUN]: Would identify user:', idOrData, data);
      return;
    }

    if (configRef.current.debug) {
      console.log('UmamiAnalytics: Identifying user:', idOrData, data);
    }

    identifyUser(idOrData, data);
  }, []);

  /**
   * Check if Umami is loaded
   */
  const isLoaded = useCallback(() => {
    return isUmamiLoaded();
  }, []);

  return {
    track,
    trackPage,
    identify,
    isLoaded,
    updateConfig,
    config: configRef.current,
  };
};
