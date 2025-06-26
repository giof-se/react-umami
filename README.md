# `@giof/react-umami` – Umami Analytics for React

A React component for Umami Analytics with **built-in dry-run testing**, debug logging, and SSR safety.

> 🧪 **Features dry-run mode for clean development** - test your tracking without polluting production data!

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

```tsx
// app/layout.tsx (App Router)
import { UmamiAnalytics } from '@giof/react-umami';

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
        <UmamiAnalytics />
      </body>
    </html>
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
```

**Framework-specific client-side variables** (required for browser access):

```env
# Next.js (client-side access requires NEXT_PUBLIC_ prefix)
NEXT_PUBLIC_UMAMI_WEBSITE_ID=your-website-id-here
NEXT_PUBLIC_UMAMI_SCRIPT_URL=https://your-umami-instance.com/script.js

# Create React App (client-side access requires REACT_APP_ prefix)
REACT_APP_UMAMI_WEBSITE_ID=your-website-id-here
REACT_APP_UMAMI_SCRIPT_URL=https://your-umami-instance.com/script.js
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

### Props

You can also configure the component through props:

```tsx
<UmamiAnalytics 
  websiteId="your-website-id" 
  src="https://your-umami-instance.com/script.js"
  domains={['example.com', 'www.example.com']}
  autoTrack={false}
/>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `websiteId` | `string` | `process.env.UMAMI_WEBSITE_ID` | Your Umami website ID |
| `src` | `string` | `process.env.UMAMI_SCRIPT_URL` or `https://cloud.umami.is/script.js` | The URL of your Umami script |
| `domains` | `string[]` | `undefined` | Restrict tracking to specific domains |
| `autoTrack` | `boolean` | `true` | Whether to automatically track page views |
| `dryRun` | `boolean` | `false` | **🧪 Enable dry run mode** - no real events sent to Umami |
| `debug` | `boolean` | `false` | **🔍 Enable debug logging** - detailed console output |

**Note**: The component checks multiple environment variable names for maximum compatibility across frameworks.

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

```tsx
// Respect user consent while maintaining functionality
<UmamiAnalytics 
  websiteId="your-website-id"
  dryRun={!userConsent.analytics}
  debug={!userConsent.analytics}
/>
```

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

### 🧪 **Dry Run Mode** - *The Game Changer*
Test analytics integration without sending real events. Perfect for development, testing, and respecting user privacy.

### 🔍 **Debug Logging** 
Detailed console output for development and troubleshooting. See exactly what's happening under the hood.

### 🛡️ **SSR Safety** 
Built-in server-side rendering protection for Next.js, Remix, and other SSR frameworks.

### ⚙️ **Runtime Configuration** 
Override settings dynamically with the `useUmami` hook. Perfect for consent management.

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

### 🧹 **Auto Cleanup** 
Automatic script removal on component unmount. No memory leaks.

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