// src/utils.ts

import { debugWarn } from './debug';
import type { UmamiEventData, UmamiTracker } from './types';

/**
 * Track a custom event with Umami
 * @param eventName - Name of the event to track
 * @param eventData - Optional data to include with the event
 */
export const trackEvent = (eventName: string, eventData?: UmamiEventData): void => {
  if (typeof window === 'undefined') {
    debugWarn('trackEvent: Not in browser environment');
    return;
  }

  if (!window.umami) {
    debugWarn('trackEvent: Umami not loaded yet');
    return;
  }

  window.umami.track(eventName, eventData);
};

/**
 * Track a page view manually (useful when autoTrack is disabled)
 * @param path - Optional path to track (defaults to current pathname)
 * @param title - Optional page title
 */
export const trackPageView = (path?: string, title?: string): void => {
  if (typeof window === 'undefined') {
    debugWarn('trackPageView: Not in browser environment');
    return;
  }

  if (!window.umami) {
    debugWarn('trackPageView: Umami not loaded yet');
    return;
  }

  const eventData: UmamiEventData = {};

  if (path) {
    eventData.path = path;
  }

  if (title) {
    eventData.title = title;
  }

  // Use a specific event name for page views
  window.umami.track('pageview', eventData);
};

export const identify = (idOrData: string | object, data?: object): void => {
  if (typeof window === 'undefined') {
    debugWarn('identify: Not in browser environment');
    return;
  }

  if (!window.umami) {
    debugWarn('identify: Umami not loaded yet');
    return;
  }

  if (typeof idOrData === 'string') {
    window.umami.identify(idOrData, data);
  } else {
    window.umami.identify(idOrData);
  }
};

/**
 * Check if Umami tracker is loaded and available
 */
export const isUmamiLoaded = (): boolean => {
  return typeof window !== 'undefined' && !!window.umami;
};

/**
 * Get the Umami tracker instance
 */
export const getUmami = (): UmamiTracker | undefined => {
  if (typeof window === 'undefined') {
    return undefined;
  }
  return window.umami;
};
