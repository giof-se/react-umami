// src/types.ts

export type UmamiTrackedProperties = {
  /**
   * Hostname of server
   */
  hostname?: string;

  /**
   * Browser language
   */
  language?: string;

  /**
   * Page referrer
   */
  referrer?: string;

  /**
   * Screen dimensions
   */
  screen?: string;

  /**
   * Page title
   */
  title?: string;

  /**
   * Page url
   */
  url?: string;

  /**
   * Website ID (required)
   */
  website: string;
};

export interface UmamiEventData {
  [key: string]: string | number | boolean | null | undefined;
}

export type UmamiEventProperties = {
  name: string;
  data?: UmamiEventData;
} & UmamiTrackedProperties;

export type UmamiCustomEventFunction = (
  props: UmamiTrackedProperties,
) => UmamiEventProperties | UmamiTrackedProperties;

export interface UmamiTracker {
  track: {
    /**
     * Track an event with a given name, with optional event data
     */
    (eventName: string, eventData?: UmamiEventData): void;
    /**
     * Track a page view
     */
    (): void;
    /**
     * Track a page with with custom properties
     */
    (properties: UmamiTrackedProperties): void;
    /**
     * Track an event with fully customizable dynamic data
     *
     * if `name` and/or `data` are not provided, it'll be treated as a page view
     */
    (eventFunction: UmamiCustomEventFunction): void;
  };
  identify: {
    /**
     * Identify a user with a unique ID and optional properties
     */
    (id: string, data?: object): void;
    /**
     * Identify a user with custom properties
     */
    (data: object): void;
  };
}

declare global {
  interface Window {
    umami?: UmamiTracker;
  }
}
