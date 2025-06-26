# `@giof-se/umami` – Umami Analytics for React

A lightweight and reusable Umami Analytics component for React applications, making it easy to integrate tracking across projects.

[![CI](https://github.com/giof-se/umami/actions/workflows/ci.yml/badge.svg)](https://github.com/giof-se/umami/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@giof-se/umami.svg)](https://www.npmjs.com/package/@giof-se/umami)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## 🚀 Installation

Install the package via **pnpm**, **npm**, or **yarn**:

```sh
pnpm add @giof-se/umami
# or
npm install @giof-se/umami
# or
yarn add @giof-se/umami
```

## 📊 Usage

Add the component to your React application:

```tsx
// In your main app component or layout
import { UmamiAnalytics } from '@giof-se/umami';

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
import { UmamiAnalytics } from '@giof-se/umami';

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
import { UmamiAnalytics } from '@giof-se/umami';

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

Configure your Umami website ID through an environment variable:

```env
# Universal (works with all frameworks)
UMAMI_WEBSITE_ID=your-website-id-here
```

**Framework-specific alternatives** (if you can't use the universal variable):

```env
# Next.js
NEXT_PUBLIC_UMAMI_WEBSITE_ID=your-website-id-here

# Create React App
REACT_APP_UMAMI_WEBSITE_ID=your-website-id-here
```

The component will check environment variables in this order:
1. `UMAMI_WEBSITE_ID` (recommended - works everywhere)
2. `NEXT_PUBLIC_UMAMI_WEBSITE_ID` (Next.js)  
3. `REACT_APP_UMAMI_WEBSITE_ID` (Create React App)

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
| `src` | `string` | `https://cloud.umami.is/script.js` | The URL of your Umami script (official CDN) |
| `domains` | `string[]` | `undefined` | Restrict tracking to specific domains |
| `autoTrack` | `boolean` | `true` | Whether to automatically track page views |

**Note**: The component checks multiple environment variable names for maximum compatibility across frameworks.

## 🧩 Features

- ⚛️ Framework-agnostic React component
- 🔌 Easy integration with any React application
- 🔧 Configurable via props or environment variables
- 📱 Works with Next.js, Create React App, Vite, and more
- 🧠 Smart defaults and duplicate script prevention
- 🪶 Lightweight with zero dependencies
- 🔒 Domain restriction support
- 🎛️ Fine-grained tracking control
- 🔄 Automatic cleanup on component unmount

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

## 📄 License

MIT © [giof-se](https://github.com/giof-se)