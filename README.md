# `@giof/react-umami` – Umami Analytics for React

A React component for Umami Analytics with **built-in dry-run testing**, debug logging, and SSR safety.

> 🧪 **Features dry-run mode for clean development** - test your tracking without polluting production data!

## 📦 Bundle Size

- **Your bundle impact**: ~2.6 kB (minified + gzipped)
- **npm package size**: 26.8 kB (includes documentation - not bundled into your app)

[![CI](https://github.com/giof-se/umami/actions/workflows/ci.yml/badge.svg)](https://github.com/giof-se/umami/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@giof/react-umami.svg)](https://www.npmjs.com/package/@giof/react-umami)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## 🚀 Installation

Install the package via **pnpm**, **npm**, or **yarn**:

```sh
pnpm add @giof/react-umami
# or
npm install @giof/react-umami
# or
yarn add @giof/react-umami
```

## 📊 Usage

Add the component to your React application:

```tsx
// In your main app component or layout
import { UmamiAnalytics } from '@giof/react-umami';

export default function App() {
  return (
    <div>
      {/* Your app content */}
      <UmamiAnalytics />
    </div>
  );
}
```

### Next.js Usage

#### App Router (Recommended)

> ⚠️ **Important for Next.js + App Router**: You MUST use a client wrapper component to avoid build errors caused by mixing server and client components. See the [complete Next.js example](examples/nextjs-app-router/) for details.

For Next.js 13+ with App Router, you need to create a client wrapper component to avoid SSR/client-side mixing issues:

**Step 1: Create a client wrapper component**

```tsx
// components/ClientUmamiAnalytics.tsx
'use client';

import dynamic from 'next/dynamic';
import type { UmamiAnalyticsProps } from '@giof/react-umami';

// Dynamically import UmamiAnalytics with SSR disabled
const UmamiAnalytics = dynamic(
  () => import('@giof/react-umami').then((mod) => ({ default: mod.UmamiAnalytics })),
  { 
    ssr: false,
    loading: () => null 
  }
);

// beforeSend is a function, so it can't come from a Server Component - define it here if needed
export default function ClientUmamiAnalytics(props: Omit<UmamiAnalyticsProps, 'beforeSend'>) {
  return <UmamiAnalytics {...props} />;
}
```

**Step 2: Use the wrapper in your layout**

```tsx
// app/layout.tsx
import ClientUmamiAnalytics from '@/components/ClientUmamiAnalytics';

export default function RootLayout({ 
  children 
}: { 
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head />
      <body>
        {children}
        <ClientUmamiAnalytics 
          dryRun={process.env.NODE_ENV === 'development'}
          debug={process.env.NODE_ENV === 'development'}
        />
      </body>
    </html>
  );
}
```

#### Pages Router (Legacy)

For Next.js Pages Router, you can use the component directly:

```tsx
// pages/_app.tsx
import { UmamiAnalytics } from '@giof/react-umami';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <UmamiAnalytics />
    </>
  );
}
```

### Create React App / Vite Usage

```tsx
// src/App.tsx
import { UmamiAnalytics } from '@giof/react-umami';

function App() {
  return (
    <div className="App">
      {/* Your app content */}
      <UmamiAnalytics />
    </div>
  );
}

export default App;
```

## ⚙️ Configuration

### Environment Variables

Configure your Umami analytics through environment variables:

```env
# Universal (works with all frameworks - server-side and build-time)
UMAMI_WEBSITE_ID=your-website-id-here
UMAMI_SCRIPT_URL=https://your-umami-instance.com/script.js
UMAMI_TAG=your-property-tag-here
```

**Framework-specific client-side variables** (required for browser access):

```env
# Next.js (client-side access requires NEXT_PUBLIC_ prefix)
NEXT_PUBLIC_UMAMI_WEBSITE_ID=your-website-id-here
NEXT_PUBLIC_UMAMI_SCRIPT_URL=https://your-umami-instance.com/script.js
NEXT_PUBLIC_UMAMI_TAG=your-property-tag-here

# Create React App (client-side access requires REACT_APP_ prefix)
REACT_APP_UMAMI_WEBSITE_ID=your-website-id-here
REACT_APP_UMAMI_SCRIPT_URL=https://your-umami-instance.com/script.js
REACT_APP_UMAMI_TAG=your-property-tag-here
```

**💡 Pro Tip:** For Next.js, you can use both! Use `UMAMI_*` for server-side and `NEXT_PUBLIC_UMAMI_*` for client-side access.

The component will check environment variables in this order:

**Website ID:**
1. `UMAMI_WEBSITE_ID` (recommended - works everywhere)
2. `NEXT_PUBLIC_UMAMI_WEBSITE_ID` (Next.js)  
3. `REACT_APP_UMAMI_WEBSITE_ID` (Create React App)

**Script URL:**
1. `UMAMI_SCRIPT_URL` (recommended - works everywhere)
2. `NEXT_PUBLIC_UMAMI_SCRIPT_URL` (Next.js)
3. `REACT_APP_UMAMI_SCRIPT_URL` (Create React App)
4. `https://cloud.umami.is/script.js` (default fallback)

**Tag:**
1. `UMAMI_TAG` (recommended - works everywhere)
2. `NEXT_PUBLIC_UMAMI_TAG` (Next.js)
3. `REACT_APP_UMAMI_TAG` (Create React App)

### Props

You can also configure the component through props:

```tsx
<UmamiAnalytics 
  websiteId="your-website-id" 
  src="https://your-umami-instance.com/script.js"
  domains={['example.com', 'www.example.com']}
  tag="marketing-site"
  autoTrack={false}
/>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `websiteId` | `string` | `process.env.UMAMI_WEBSITE_ID` | Your Umami website ID |
| `src` | `string` | `process.env.UMAMI_SCRIPT_URL` or `https://cloud.umami.is/script.js` | The URL of your Umami script |
| `domains` | `string[]` | `undefined` | Restrict tracking to specific domains |
| `tag` | `string` | `process.env.UMAMI_TAG` | Tag events so multiple properties can share one website ID |
| `autoTrack` | `boolean` | `true` | Whether to automatically track page views |
| `autoPageview` | `boolean` | `true` | Send the initial page view on load (`data-auto-pageview`) |
| `performance` | `boolean` | `false` | Collect Core Web Vitals (`data-performance`) - see [Core Web Vitals](#-core-web-vitals) |
| `beforeSend` | `(type, payload) => payload \| null \| Promise<...>` | `undefined` | Inspect, modify or drop every payload before it is sent - see [Pre-send hook](#-pre-send-hook-beforesend) |
| `hostUrl` | `string` | `undefined` | Send data to a different Umami host (`data-host-url`) |
| `excludeSearch` | `boolean` | `false` | Strip query strings from tracked URLs (`data-exclude-search`) |
| `excludeHash` | `boolean` | `false` | Strip hashes from tracked URLs (`data-exclude-hash`) |
| `doNotTrack` | `boolean` | `false` | Respect the browser's Do Not Track setting (`data-do-not-track`) |
| `distinctId` | `string` | `undefined` | Identify the visitor as soon as the tracker loads (`data-distinct-id`) |
| `fetchCredentials` | `RequestCredentials` | `'omit'` | `credentials` mode for collect requests (`data-fetch-credentials`) |
| `dryRun` | `boolean` | `false` | **🧪 Enable dry run mode** - no real events sent to Umami |
| `debug` | `boolean` | `false` | **🔍 Enable debug logging** - detailed console output, including warnings from the tracking helpers |

**Note**: The component checks multiple environment variable names for maximum compatibility across frameworks.

**Note**: Props are read once, when the component mounts. Changing them afterwards has no effect, except `beforeSend` - the latest function passed is always the one called.

Each tracker option maps to one of Umami's [tracker configuration](https://umami.is/docs/tracker-configuration) attributes. Older self-hosted Umami versions ignore attributes they don't support.

## 📈 Core Web Vitals

```tsx
<UmamiAnalytics websiteId="your-website-id" performance />
```

The tracker reports TTFB, FCP, LCP, CLS and INP as `performance` payloads. This needs an Umami version whose tracker supports `data-performance`; older versions ignore it.

## 🪝 Pre-send hook (`beforeSend`)

`beforeSend` is called with the payload type (`'event'`, `'identify'`, `'performance'`, ...) and the payload before anything is sent. Return the payload (modified or not) to send it, or `null` to drop it. It may be async.

```tsx
import { UmamiAnalytics, type UmamiBeforeSend } from '@giof/react-umami';

const beforeSend: UmamiBeforeSend = (type, payload) => {
  // Drop events from internal pages
  if (typeof payload.url === 'string' && payload.url.startsWith('/admin')) return null;

  // Strip tokens from URLs
  if (typeof payload.url === 'string') {
    return { ...payload, url: payload.url.replace(/token=[^&]+/, 'token=redacted') };
  }
  return payload;
};

<UmamiAnalytics websiteId="your-website-id" beforeSend={beforeSend} />;
```

- Pass `beforeSend` on the first render; the hook is only wired up if it's present when the component mounts.
- Umami's `data-before-send` attribute takes the *name* of a global function, so the component registers yours as `window.__umamiBeforeSend` (exported as `UMAMI_BEFORE_SEND_GLOBAL`).
- In dry run mode, the mock tracker runs `beforeSend` too and logs what would be sent or dropped.
- **Next.js App Router**: functions can't be passed from a Server Component to a Client Component, so define `beforeSend` inside your `'use client'` wrapper rather than in `layout.tsx`.

## 🔒 Consent

Once Umami's tracker has loaded, it hooks into the browser's history API and sends a pageview (and Web Vitals, with `performance`) on every client-side navigation until the page reloads. Unmounting `<UmamiAnalytics>`, removing the `<script>` tag or deleting `window.umami` does **not** stop it.

What does stop it: the tracker calls `beforeSend` before every send and drops the payload when it returns `null`. Use it as the consent gate:

```tsx
'use client';

import { UmamiAnalytics, type UmamiBeforeSend } from '@giof/react-umami';
import { getAnalyticsConsent, useAnalyticsConsent } from './consent'; // your consent store

// Reads consent at send time - don't close over React state here
const dropUnlessConsented: UmamiBeforeSend = (_type, payload) =>
  getAnalyticsConsent() === true ? payload : null;

export function Analytics() {
  const consent = useAnalyticsConsent();

  // Visitors who haven't consented never download the tracker
  if (consent !== true) return null;

  return <UmamiAnalytics websiteId="your-website-id" beforeSend={dropUnlessConsented} />;
}
```

- **Revoked after load**: `Analytics` unmounts, but the gate stays registered and starts returning `null`, so pageviews, Web Vitals, `identify` and your own `trackEvent` calls are all dropped.
- **Granted again on the same page**: the component remounts, finds the script already loaded and re-registers the gate; tracking resumes from the next send.
- `dryRun` and `useUmami().updateConfig()` are **not** consent switches: `dryRun` is read once on mount, and `updateConfig` only affects that hook's own calls.
- Umami also honours `localStorage.setItem('umami.disabled', '1')` as a per-browser opt-out, checked before every send.

## 🧪 Dry Run Mode

**Built-in dry-run testing for clean development!** 

### What is Dry Run Mode?

When `dryRun={true}`, the component:
- 🚫 **Never loads external scripts** - no network requests to Umami servers
- 🎭 **Creates a mock tracker** - your app works exactly the same
- 📝 **Logs all events to console** - see exactly what would be tracked
- 🛡️ **Protects your data** - no test/dev events pollute production analytics

### Perfect for Development

```tsx
// Environment-aware setup
<UmamiAnalytics 
  websiteId="your-website-id"
  dryRun={process.env.NODE_ENV === 'development'}
  debug={process.env.NODE_ENV === 'development'}
/>
```

**What you'll see in console:**
```
UmamiAnalytics [DRY RUN]: Would track event: button_click {
  button: "signup",
  location: "header",
  userId: "123"
}
```

### Testing Made Easy

```tsx
// Test your analytics without external dependencies
describe('Analytics Integration', () => {
  it('tracks user signup', () => {
    render(<App />);
    
    fireEvent.click(screen.getByText('Sign Up'));
    
    // Verify tracking calls in dry run mode
    expect(console.log).toHaveBeenCalledWith(
      'UmamiAnalytics [DRY RUN]: Would track event:',
      'signup',
      { source: 'header' }
    );
  });
});
```

### Privacy & Compliance

`dryRun` is read once, when the component mounts, so it can't act as a consent switch. For consent that can change while the page is open, see [Consent](#-consent).

### Why This Matters

❌ **Other libraries force you to choose:**
- Pollute production data with test events
- Complex mocking setup for testing
- No visibility into what's being tracked

✅ **With dry run mode:**
- Clean production data guaranteed
- Zero-config testing
- Full transparency of tracking behavior
- Same API in development and production

## 🚀 Advanced Usage Examples

### Development & Testing

```tsx
// Perfect for development - see everything that's happening
<UmamiAnalytics 
  websiteId="your-website-id"
  debug={true}
  dryRun={true}  // No real events sent in development
/>
```

### Event Tracking with Utilities

```tsx
import { UmamiAnalytics, trackEvent, trackPageView } from '@giof/react-umami';

// Track custom events
const handleButtonClick = () => {
  trackEvent('button_click', { 
    button: 'signup',
    location: 'header' 
  });
};

// Track page views manually
const handleNavigation = (path: string) => {
  trackPageView(path, 'Custom Page Title');
};
```

`trackEvent`, `trackPageView` and `identify` silently do nothing when the tracker isn't loaded (not consented yet, blocked, or during SSR). Mount `<UmamiAnalytics debug>` to get a console warning for each skipped call.

### Advanced Hook Usage

```tsx
import { useUmami } from '@giof/react-umami';
import { useEffect } from 'react';

function MyComponent() {
  const { track, trackPage, isLoaded, updateConfig } = useUmami();

  // Override configuration at runtime
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      updateConfig({ dryRun: true, debug: true });
    }
  }, [updateConfig]);

  const handleClick = () => {
    track('user_action', { component: 'MyComponent' });
  };

  return <button onClick={handleClick}>Track Me</button>;
}
```

### Self-Hosted Umami Configuration

```tsx
// Using environment variables for self-hosted Umami
<UmamiAnalytics 
  domains={['yoursite.com', 'www.yoursite.com']}
/>
```

```env
# .env file
UMAMI_WEBSITE_ID=your-website-id-here
UMAMI_SCRIPT_URL=https://analytics.yourcompany.com/script.js
```

### Production Configuration

```tsx
// Perfect for production - minimal setup, maximum reliability
<UmamiAnalytics 
  domains={['yoursite.com', 'www.yoursite.com']}
  autoTrack={true}
/>
```

## ✨ Features

### 🧪 **Dry Run Mode** 
Test analytics integration without sending real events. Perfect for development, testing, and respecting user privacy.

### 🔍 **Debug Logging** 
Detailed console output for development and troubleshooting. See exactly what's happening under the hood.

### 🛡️ **SSR Safety** 
Built-in server-side rendering protection for Next.js, Remix, and other SSR frameworks. Includes Next.js App Router integration guide.

### ⚙️ **Runtime Configuration** 
Override settings dynamically with the `useUmami` hook.

### 🔒 **Consent Gate**
`beforeSend` drops every payload once consent is revoked - including pageviews from a tracker that's already loaded. See [Consent](#-consent).

### 🎯 **Event Tracking Helpers** 
Simple `trackEvent()` and `trackPageView()` utilities for custom analytics.

### 🌐 **Framework Agnostic** 
Works seamlessly with Next.js, Create React App, Vite, Remix, and any React setup.

### 🔧 **Environment Variables** 
Universal `UMAMI_WEBSITE_ID` with automatic framework fallbacks for maximum compatibility.

### 📘 **Full TypeScript Support** 
Complete type definitions included. IntelliSense and type safety out of the box.

### 📦 **Zero Dependencies** 
No external dependencies. Lightweight and fast.

### 🚫 **Duplicate Prevention** 
Smart script injection prevents conflicts and duplicate loading.

### 🏠 **Domain Restrictions** 
Limit tracking to specific domains for enhanced security.

## 🛠️ Development

Clone and set up the project:

```sh
# Clone repository
git clone https://github.com/giof-se/umami.git
cd umami

# Install dependencies
pnpm install

# Run tests
pnpm test

# Format code
pnpm fmt

# Lint code
pnpm lint
```

## 🧪 Testing

Run tests with:

```sh
# Run tests once
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

## 🚢 Releasing

This project uses automated versioning and changelog generation:

### Automated Workflow

1. Push your changes to the `main` branch
2. Version is automatically bumped based on commit message types:
   - `feat:` or `feature:` for minor version bump
   - `BREAKING CHANGE:` or `major:` for major version bump
   - All other changes result in patch version bump
3. Changelog is automatically generated from commit messages
4. New version is tagged and published to GitHub Packages

### Commit Message Format

For best results with autoversioning, follow the [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

Example commit messages:
- `feat: add domain restriction support` (triggers minor version bump)
- `fix: correct data attribute handling` (triggers patch version bump)
- `feat: add XYZ with BREAKING CHANGE: requires new config` (triggers major version bump)

## Improved CI/CD Pipeline

The CI/CD pipeline follows these steps:

1. The Autoversion workflow runs when changes are pushed to the main branch
2. It automatically increments the version based on commit messages
3. The Publish workflow creates a GitHub release and publishes the package

The workflow has been enhanced to handle different trigger methods:
- Direct tag pushes
- Manual workflow dispatch with version input
- Automated workflow runs from the autoversion workflow

## Comparison

| Feature | @giof/react-umami | Other Libraries |
|---------|----------------------|-----------------|
| Dry Run Testing | ✅ | ❌ |
| Debug Logging | ✅ | Limited |
| SSR Safety | ✅ | Manual setup |
| Runtime Config | ✅ | Static only |
| Framework Support | Universal | Framework-specific |
| TypeScript | Full support | Varies |
| Dependencies | Zero | Varies |

## Support

- **🐛 Bug Reports**: [Open an issue](https://github.com/giof-se/umami/issues/new)
- **💡 Feature Requests**: [Open an issue](https://github.com/giof-se/umami/issues/new)
- **📖 Contributing**: See [CONTRIBUTING.md](CONTRIBUTING.md)
- **💬 Questions**: [GitHub Discussions](https://github.com/giof-se/umami/discussions)

## License

MIT © [giof-se](https://github.com/giof-se)