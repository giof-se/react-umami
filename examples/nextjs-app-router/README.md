# Next.js App Router Integration Example

This example demonstrates how to properly integrate `@giof/react-umami` with Next.js 13+ App Router to avoid SSR/client-side mixing issues.

## The Problem

When using `@giof/react-umami` directly in Next.js App Router server components (like `app/layout.tsx`), you'll encounter build errors due to mixing server and client-side code:

```
Error: Cannot use import statement outside a module
Error: useEffect is not defined
```

This happens because:
- Server components run on the server during build/SSR
- The `UmamiAnalytics` component uses client-side APIs (`useEffect`, `document`, `window`)
- Next.js App Router enforces strict separation between server and client components

## The Solution

Create a client wrapper component that dynamically imports `UmamiAnalytics` with SSR disabled.

### Step 1: Create Client Wrapper Component

Create `components/ClientUmamiAnalytics.tsx`:

```tsx
'use client';

import dynamic from 'next/dynamic';

// Dynamically import UmamiAnalytics with SSR disabled
const UmamiAnalytics = dynamic(
  () => import('@giof/react-umami').then((mod) => ({ default: mod.UmamiAnalytics })),
  { 
    ssr: false,
    loading: () => null 
  }
);

interface ClientUmamiAnalyticsProps {
  websiteId?: string;
  src?: string;
  domains?: string[];
  autoTrack?: boolean;
  dryRun?: boolean;
  debug?: boolean;
}

export default function ClientUmamiAnalytics(props: ClientUmamiAnalyticsProps) {
  return <UmamiAnalytics {...props} />;
}
```

### Step 2: Use in Your Layout

Update `app/layout.tsx`:

```tsx
import ClientUmamiAnalytics from '@/components/ClientUmamiAnalytics';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Your App',
  description: 'Your app description',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        
        {/* Umami Analytics - Properly wrapped for App Router */}
        <ClientUmamiAnalytics 
          dryRun={process.env.NODE_ENV === 'development'}
          debug={process.env.NODE_ENV === 'development'}
        />
      </body>
    </html>
  );
}
```

### Step 3: Environment Variables

Create `.env.local`:

```env
# Next.js App Router - Use NEXT_PUBLIC_ for client-side access
NEXT_PUBLIC_UMAMI_WEBSITE_ID=your-website-id-here
NEXT_PUBLIC_UMAMI_SCRIPT_URL=https://your-umami-instance.com/script.js

# Or use universal variables (recommended)
UMAMI_WEBSITE_ID=your-website-id-here
UMAMI_SCRIPT_URL=https://your-umami-instance.com/script.js
```

## Why This Works

1. **`'use client'` directive**: Marks the wrapper as a client component
2. **Dynamic import with `ssr: false`**: Prevents server-side execution
3. **Proper component separation**: Server components stay on server, client components on client
4. **Environment variable access**: Both server and client variables are supported

## Development vs Production

The example includes environment-aware configuration:

```tsx
<ClientUmamiAnalytics 
  dryRun={process.env.NODE_ENV === 'development'}  // No real events in dev
  debug={process.env.NODE_ENV === 'development'}   // Debug logging in dev
/>
```

### Development Mode Benefits

- **Dry run mode**: No real analytics events sent to Umami
- **Debug logging**: See all tracking calls in console
- **Clean data**: No test/development events in production analytics

### Production Mode

- **Real tracking**: Events sent to Umami servers
- **No debug output**: Clean console logs
- **Optimized performance**: No unnecessary logging

## Advanced Usage

### Custom Event Tracking

```tsx
// In any client component
import { useUmami } from '@giof/react-umami';

function MyComponent() {
  const { track } = useUmami();

  const handleClick = () => {
    track('button_click', { 
      button: 'signup',
      location: 'header' 
    });
  };

  return <button onClick={handleClick}>Sign Up</button>;
}
```

### Utility Functions

```tsx
// In any component (client or server)
import { trackEvent, trackPageView } from '@giof/react-umami';

// These work with the dry-run mode automatically
trackEvent('user_action', { action: 'download' });
trackPageView('/custom-page', 'Custom Page Title');
```

## Common Issues & Solutions

### Build Errors

❌ **Error**: `useEffect is not defined`
✅ **Solution**: Use the client wrapper component

❌ **Error**: `Cannot use import statement outside a module`
✅ **Solution**: Ensure proper dynamic import with `ssr: false`

### Runtime Issues

❌ **Issue**: Analytics not loading
✅ **Check**: Environment variables are properly prefixed (`NEXT_PUBLIC_`)

❌ **Issue**: Events not tracking
✅ **Check**: Dry run mode is disabled in production

## Migration from Other Libraries

If migrating from `@giof-se/umami` or other libraries:

1. Replace the old import with the new client wrapper
2. Update environment variable names if needed
3. Enable dry-run mode for development
4. Test in both development and production

## Next.js Compatibility

This pattern works with:
- ✅ Next.js 13+ App Router
- ✅ Next.js 14+ App Router  
- ✅ Next.js 15+ App Router
- ✅ React 18+
- ✅ React 19+

For Pages Router (`pages/_app.tsx`), you can use `UmamiAnalytics` directly without the wrapper.

## Troubleshooting

### Check Environment Variables

```bash
# In your Next.js app, create a debug page
// app/debug/page.tsx
export default function DebugPage() {
  return (
    <pre>
      {JSON.stringify({
        NODE_ENV: process.env.NODE_ENV,
        UMAMI_WEBSITE_ID: process.env.UMAMI_WEBSITE_ID,
        NEXT_PUBLIC_UMAMI_WEBSITE_ID: process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID,
      }, null, 2)}
    </pre>
  );
}
```

### Enable Debug Mode

```tsx
<ClientUmamiAnalytics 
  debug={true}  // Always show debug info
  dryRun={true} // Test without real events
/>
```

This will show detailed console output about script loading and event tracking. 