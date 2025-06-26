'use client';

import { useUmami } from '@giof/react-umami';

export default function HomePage() {
  const { track } = useUmami();

  const handleButtonClick = (buttonName: string) => {
    track('button_click', {
      button: buttonName,
      page: 'home',
    });
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Next.js App Router + Umami Analytics
          </h1>
          <p className="text-lg text-gray-600">
            Example integration of @giof/react-umami with Next.js 13+ App Router
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">🚀 Features Demonstrated</h2>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✅</span>
                Server-side rendering compatibility
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✅</span>
                Automatic page view tracking
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✅</span>
                Custom event tracking
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✅</span>
                Development dry-run mode
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✅</span>
                Debug logging
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">🧪 Test Custom Events</h2>
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => handleButtonClick('signup')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Track Sign Up Event
              </button>
              <button
                type="button"
                onClick={() => handleButtonClick('download')}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Track Download Event
              </button>
              <button
                type="button"
                onClick={() => handleButtonClick('contact')}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Track Contact Event
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              {process.env.NODE_ENV === 'development'
                ? '🔧 Development mode: Events logged to console (dry-run)'
                : '📊 Production mode: Events sent to Umami'}
            </p>
          </div>
        </div>

        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">📖 Setup Instructions</h2>
          <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700">
            <p className="mb-2">
              1. Copy <code className="bg-gray-200 px-1 rounded">.env.local.example</code> to{' '}
              <code className="bg-gray-200 px-1 rounded">.env.local</code>
            </p>
            <p className="mb-2">
              2. Set your <code className="bg-gray-200 px-1 rounded">UMAMI_WEBSITE_ID</code> and
              optionally <code className="bg-gray-200 px-1 rounded">UMAMI_SCRIPT_URL</code>
            </p>
            <p className="mb-2">
              3. Run <code className="bg-gray-200 px-1 rounded">pnpm dev</code> to start development
              server
            </p>
            <p>4. Check browser console for debug output in development mode</p>
          </div>
        </div>
      </div>
    </main>
  );
}
