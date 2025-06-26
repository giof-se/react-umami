// src/UmamiAnalytics.tsx

import React, { useEffect } from 'react';

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
}

export const UmamiAnalytics = ({
  websiteId,
  src,
  domains,
  autoTrack = true,
}: UmamiAnalyticsProps) => {
  const finalWebsiteId =
    websiteId ??
    process.env.UMAMI_WEBSITE_ID ??
    process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID ??
    process.env.REACT_APP_UMAMI_WEBSITE_ID;
  const finalSrc = src ?? 'https://cloud.umami.is/script.js';

  useEffect(() => {
    if (!finalWebsiteId) {
      console.warn('UmamiAnalytics: No websiteId provided.');
      return;
    }

    // Check if script already exists
    const existingScript = document.querySelector(`script[src="${finalSrc}"]`);
    if (existingScript) {
      return;
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

    // Append script to document head
    document.head.appendChild(script);

    // Cleanup function to remove script on unmount
    return () => {
      const scriptToRemove = document.querySelector(`script[src="${finalSrc}"]`);
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [finalWebsiteId, finalSrc, domains, autoTrack]);

  // Return null as this component doesn't render any visible content
  return null;
};
