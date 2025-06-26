// src/utils.ts

import type { UmamiEventData, UmamiTracker } from './types';

/**
 * Track a custom event with Umami
 * @param eventName - Name of the event to track
 * @param eventData - Optional data to include with the event
 */
export const trackEvent = (eventName: string, eventData?: UmamiEventData): void => {
  if (typeof window === 'undefined') {
    console.warn('trackEvent: Not in browser environment');
    return;
  }

  if (!window.umami) {
    console.warn('trackEvent: Umami not loaded yet');
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
    console.warn('trackPageView: Not in browser environment');
    return;
  }

  if (!window.umami) {
    console.warn('trackPageView: Umami not loaded yet');
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
