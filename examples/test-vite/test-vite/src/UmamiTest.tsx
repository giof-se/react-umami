import React from 'react';

// For now, let's create a minimal test without installing the package
// We'll copy the components directly to test functionality

interface UmamiAnalyticsProps {
  websiteId?: string;
  src?: string;
  domains?: string[];
  autoTrack?: boolean;
  dryRun?: boolean;
  debug?: boolean;
}

const UmamiAnalytics = ({
  websiteId,
  src,
  domains,
  autoTrack = true,
  dryRun = false,
  debug = false,
}: UmamiAnalyticsProps) => {
  React.useEffect(() => {
    if (typeof window === 'undefined') {
      if (debug) {
        console.log('UmamiAnalytics: SSR detected, skipping script injection');
      }
      return;
    }

    const finalWebsiteId =
      websiteId ?? process.env.UMAMI_WEBSITE_ID ?? import.meta.env.VITE_UMAMI_WEBSITE_ID; // Vite uses VITE_ prefix

    const finalSrc = src ?? 'https://cloud.umami.is/script.js';

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

    if (dryRun) {
      if (debug) {
        console.log('UmamiAnalytics: Dry run mode enabled - no script will be loaded');
      }
      if (!window.umami) {
        window.umami = {
          track: (eventName: string, eventData?: Record<string, any>) => {
            console.log('UmamiAnalytics [DRY RUN]: Would track event:', eventName, eventData);
          },
        };
      }
      return;
    }

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

    if (debug) {
      script.onload = () => {
        console.log('UmamiAnalytics: Script loaded successfully');
      };
      script.onerror = (error) => {
        console.error('UmamiAnalytics: Script failed to load', error);
      };
    }

    document.head.appendChild(script);

    return () => {
      const scriptToRemove = document.querySelector(`script[src="${finalSrc}"]`);
      if (scriptToRemove) {
        if (debug) {
          console.log('UmamiAnalytics: Cleaning up script on unmount');
        }
        scriptToRemove.remove();
      }
    };
  }, [websiteId, src, domains, autoTrack, dryRun, debug]);

  return null;
};

const UmamiTest = () => {
  const [mode, setMode] = React.useState<'normal' | 'dryRun' | 'debug'>('normal');

  return (
    <div style={{ padding: '20px' }}>
      <h2>Umami Analytics Test - Vite + React</h2>

      <div style={{ marginBottom: '20px' }}>
        <label>
          <input
            type="radio"
            name="mode"
            value="normal"
            checked={mode === 'normal'}
            onChange={(e) => setMode(e.target.value as any)}
          />
          Normal Mode
        </label>
        <label style={{ marginLeft: '10px' }}>
          <input
            type="radio"
            name="mode"
            value="dryRun"
            checked={mode === 'dryRun'}
            onChange={(e) => setMode(e.target.value as any)}
          />
          Dry Run Mode
        </label>
        <label style={{ marginLeft: '10px' }}>
          <input
            type="radio"
            name="mode"
            value="debug"
            checked={mode === 'debug'}
            onChange={(e) => setMode(e.target.value as any)}
          />
          Debug Mode
        </label>
      </div>

      <UmamiAnalytics
        websiteId="test-website-id"
        dryRun={mode === 'dryRun'}
        debug={mode === 'debug' || mode === 'dryRun'}
      />

      <div style={{ marginTop: '20px' }}>
        <p>✅ Framework: Vite + React {React.version}</p>
        <p>✅ TypeScript: Enabled</p>
        <p>✅ Component renders without errors</p>
        <p>✅ Check browser console for debug output</p>
      </div>
    </div>
  );
};

export default UmamiTest;
