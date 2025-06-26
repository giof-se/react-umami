import { trackEvent, UmamiAnalytics, useUmami } from '@giof/react-umami';
import React from 'react';

type Mode = 'normal' | 'dryRun' | 'debug';

const UmamiTest = () => {
  const [mode, setMode] = React.useState<Mode>('dryRun');
  const { track } = useUmami();

  const handleModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMode(event.target.value as Mode);
  };

  const handleTestEvent = (eventName: string) => {
    track(eventName, {
      source: 'vite-example',
      mode: mode,
      timestamp: new Date().toISOString(),
    });
  };

  const handleUtilityEvent = () => {
    trackEvent('utility_function_test', {
      source: 'vite-example',
      method: 'trackEvent',
    });
  };

  return (
    <div
      style={{
        padding: '20px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        backgroundColor: '#f5f5f5',
        minHeight: '100vh',
      }}
    >
      <div
        style={{
          maxWidth: '800px',
          margin: '0 auto',
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        }}
      >
        <h1 style={{ color: '#333', marginBottom: '10px' }}>Umami Analytics Test - Vite + React</h1>
        <p style={{ color: '#666', marginBottom: '30px' }}>
          Testing @giof/react-umami integration with Vite and React {React.version}
        </p>

        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '15px' }}>Analytics Mode:</h3>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="radio"
                name="mode"
                value="normal"
                checked={mode === 'normal'}
                onChange={handleModeChange}
                style={{ marginRight: '8px' }}
              />
              Normal Mode
            </label>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="radio"
                name="mode"
                value="dryRun"
                checked={mode === 'dryRun'}
                onChange={handleModeChange}
                style={{ marginRight: '8px' }}
              />
              Dry Run Mode (Recommended)
            </label>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="radio"
                name="mode"
                value="debug"
                checked={mode === 'debug'}
                onChange={handleModeChange}
                style={{ marginRight: '8px' }}
              />
              Debug Mode
            </label>
          </div>
        </div>

        <UmamiAnalytics
          websiteId="test-website-id-vite-example"
          dryRun={mode === 'dryRun'}
          debug={mode === 'debug' || mode === 'dryRun'}
        />

        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '15px' }}>Test Custom Events:</h3>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => handleTestEvent('button_click')}
              style={{
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Test Button Click
            </button>
            <button
              type="button"
              onClick={() => handleTestEvent('feature_used')}
              style={{
                padding: '10px 20px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Test Feature Usage
            </button>
            <button
              type="button"
              onClick={handleUtilityEvent}
              style={{
                padding: '10px 20px',
                backgroundColor: '#6f42c1',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Test Utility Function
            </button>
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#f8f9fa',
            padding: '20px',
            borderRadius: '4px',
            marginBottom: '20px',
          }}
        >
          <h3 style={{ marginBottom: '15px' }}>Status:</h3>
          <div style={{ display: 'grid', gap: '8px' }}>
            <p style={{ margin: 0 }}>✅ Framework: Vite + React {React.version}</p>
            <p style={{ margin: 0 }}>✅ TypeScript: Enabled</p>
            <p style={{ margin: 0 }}>✅ Component renders without errors</p>
            <p style={{ margin: 0 }}>✅ Custom event tracking: Available</p>
            <p style={{ margin: 0, color: mode === 'dryRun' ? '#28a745' : '#6c757d' }}>
              {mode === 'dryRun'
                ? '🔧 Dry run mode: Events logged to console'
                : mode === 'debug'
                  ? '🐛 Debug mode: Verbose logging enabled'
                  : '📊 Normal mode: Events sent to Umami'}
            </p>
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#e9ecef',
            padding: '15px',
            borderRadius: '4px',
            fontSize: '14px',
          }}
        >
          <strong>Instructions:</strong>
          <ol style={{ margin: '10px 0', paddingLeft: '20px' }}>
            <li>Open browser developer console</li>
            <li>Select "Dry Run Mode" to see event logging</li>
            <li>Click the test buttons above</li>
            <li>Check console for debug output</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default UmamiTest;
