import type { Metadata } from 'next';
import './globals.css';
import ClientUmamiAnalytics from '@/components/ClientUmamiAnalytics';

export const metadata: Metadata = {
  title: 'Next.js App Router + Umami Analytics',
  description: 'Example integration of @giof/react-umami with Next.js App Router',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}

        {/* Umami Analytics - Properly wrapped for App Router */}
        <ClientUmamiAnalytics
          // Environment variables will be used automatically:
          // UMAMI_WEBSITE_ID or NEXT_PUBLIC_UMAMI_WEBSITE_ID
          // UMAMI_SCRIPT_URL or NEXT_PUBLIC_UMAMI_SCRIPT_URL

          // Enable dry-run and debug mode in development
          dryRun={process.env.NODE_ENV === 'development'}
          debug={process.env.NODE_ENV === 'development'}

          // Optional: restrict to specific domains
          // domains={['example.com', 'www.example.com']}

          // Optional: disable auto page tracking
          // autoTrack={false}
        />
      </body>
    </html>
  );
}
