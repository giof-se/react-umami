'use client';

import dynamic from 'next/dynamic';

// Dynamically import UmamiAnalytics with SSR disabled
const UmamiAnalytics = dynamic(
  () => import('@giof/react-umami').then((mod) => ({ default: mod.UmamiAnalytics })),
  {
    ssr: false,
    loading: () => null,
  },
);

interface ClientUmamiAnalyticsProps {
  websiteId?: string;
  src?: string;
  domains?: string[];
  autoTrack?: boolean;
  dryRun?: boolean;
  debug?: boolean;
}

/**
 * Client-side wrapper for UmamiAnalytics component
 *
 * This wrapper is necessary for Next.js App Router to prevent
 * SSR/client-side mixing issues. The UmamiAnalytics component
 * needs to run only on the client side.
 *
 * Usage in app/layout.tsx:
 * ```tsx
 * import ClientUmamiAnalytics from '@/components/ClientUmamiAnalytics';
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         {children}
 *         <ClientUmamiAnalytics
 *           dryRun={process.env.NODE_ENV === 'development'}
 *           debug={process.env.NODE_ENV === 'development'}
 *         />
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 */
export default function ClientUmamiAnalytics(props: ClientUmamiAnalyticsProps) {
  return <UmamiAnalytics {...props} />;
}
