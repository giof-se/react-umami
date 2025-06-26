# Framework Test Results

This document tracks the testing status of `@giof/react-umami` across different React frameworks and build tools.

## Test Matrix

| Framework | Version | Status | Example | Notes |
|-----------|---------|--------|---------|-------|
| **Next.js App Router** | 13+ | ✅ Working | [`nextjs-app-router/`](./nextjs-app-router/) | Requires client wrapper component |
| **Vite + React** | Latest | ✅ Working | [`test-vite/`](./test-vite/) | Direct integration works |
| **Next.js Pages Router** | 12+ | 🔄 Planned | - | Coming soon |
| **Create React App** | 5.x | 🔄 Planned | - | Coming soon |
| **Remix** | Latest | 🔄 Planned | - | Coming soon |
| **Gatsby** | 4+ | 🔄 Planned | - | Coming soon |

## Next.js App Router ✅

**Status**: Working with wrapper component  
**Tested**: ✅ Complete example available  
**Example**: [`examples/nextjs-app-router/`](./nextjs-app-router/)

### Features Demonstrated
- ✅ **Server-side rendering compatibility**
- ✅ **Automatic page view tracking**
- ✅ **Custom event tracking with `useUmami` hook**
- ✅ **Development dry-run mode**
- ✅ **Debug logging**
- ✅ **Environment variable configuration**
- ✅ **TypeScript support**
- ✅ **Beautiful demo UI with Tailwind CSS**

### Integration Method
```tsx
// components/ClientUmamiAnalytics.tsx
'use client';
import dynamic from 'next/dynamic';

const UmamiAnalytics = dynamic(
  () => import('@giof/react-umami').then((mod) => ({ default: mod.UmamiAnalytics })),
  { ssr: false, loading: () => null }
);

export default function ClientUmamiAnalytics(props) {
  return <UmamiAnalytics {...props} />;
}
```

### Issues Resolved
- ❌ `useEffect is not defined` → ✅ Client wrapper component
- ❌ `Cannot use import statement` → ✅ Dynamic import with `ssr: false`
- ❌ SSR/client mixing errors → ✅ Proper component separation

## Vite + React ✅

**Status**: Working with direct integration  
**Tested**: ✅ Complete example available  
**Example**: [`examples/test-vite/`](./test-vite/)

### Features Demonstrated
- ✅ **Direct component integration**
- ✅ **Custom event tracking with `useUmami` hook**
- ✅ **Utility function tracking with `trackEvent`**
- ✅ **Development dry-run mode**
- ✅ **Debug logging**
- ✅ **Vite environment variables (`VITE_` prefix)**
- ✅ **TypeScript support**
- ✅ **Hot Module Replacement compatibility**
- ✅ **Interactive test interface**

### Integration Method
```tsx
import { UmamiAnalytics, useUmami, trackEvent } from '@giof/react-umami';

function App() {
  return (
    <div>
      <UmamiAnalytics
        websiteId="your-website-id"
        dryRun={import.meta.env.DEV}
        debug={import.meta.env.DEV}
      />
      {/* Your app content */}
    </div>
  );
}
```

### Notes
- ✅ No special configuration needed
- ✅ Works with HMR out of the box
- ✅ Environment variables need `VITE_` prefix
- ✅ Full ESM support

## Quick Start Guide

### 1. Choose Your Framework

- **Next.js App Router**: Use the client wrapper pattern
- **Vite + React**: Direct integration

### 2. Install Dependencies

```bash
pnpm add @giof/react-umami
```

### 3. Configure Environment Variables

**Next.js:**
```env
UMAMI_WEBSITE_ID=your-website-id-here
UMAMI_SCRIPT_URL=https://your-umami-instance.com/script.js
```

**Vite:**
```env
VITE_UMAMI_WEBSITE_ID=your-website-id-here
VITE_UMAMI_SCRIPT_URL=https://your-umami-instance.com/script.js
```

### 4. Run Example

```bash
cd examples/nextjs-app-router  # or examples/test-vite
pnpm install
pnpm dev
```

## Development vs Production

Both examples include environment-aware configuration:

### Development Mode (Recommended)
- **Dry Run**: Events logged to console, not sent to Umami
- **Debug Logging**: Verbose output for troubleshooting  
- **Clean Data**: No test events in production analytics

### Production Mode
- **Real Tracking**: Events sent to Umami servers
- **Clean Console**: No debug output
- **Optimized Performance**: Minimal overhead

## Common Patterns

### Custom Event Tracking
```tsx
import { useUmami } from '@giof/react-umami';

function MyComponent() {
  const { track } = useUmami();
  
  const handleClick = () => {
    track('button_click', { button: 'signup' });
  };
  
  return <button onClick={handleClick}>Sign Up</button>;
}
```

### Utility Function Tracking
```tsx
import { trackEvent } from '@giof/react-umami';

// Can be called from anywhere
trackEvent('user_action', { action: 'download' });
```

## Troubleshooting

### Common Issues

**TypeScript errors about module not found:**
- Ensure `@giof/react-umami` is installed as a dependency
- Check that the package is properly built

**Events not tracking:**
- Verify environment variables are set correctly
- Check browser console for errors
- Ensure website ID matches your Umami instance

**Build errors in Next.js:**
- Use the client wrapper component pattern
- Ensure dynamic import has `ssr: false`

**Environment variables not working:**
- Next.js: Use `UMAMI_*` or `NEXT_PUBLIC_UMAMI_*`
- Vite: Use `VITE_UMAMI_*` prefix

## Environment Variable Priority

The component checks environment variables in this order:
1. `websiteId` prop (highest priority)
2. `UMAMI_WEBSITE_ID` (universal)
3. Framework-specific variables:
   - Next.js: `NEXT_PUBLIC_UMAMI_WEBSITE_ID`
   - Create React App: `REACT_APP_UMAMI_WEBSITE_ID`
   - Vite: `VITE_UMAMI_WEBSITE_ID`