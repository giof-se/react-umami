# `@giof-se/umami` – Umami Analytics for Next.js

A lightweight and reusable Umami Analytics component for Next.js, making it easy to integrate tracking across projects.

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

Add the component to your Next.js app's layout or page:

```tsx
// app/layout.tsx
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

## ⚙️ Configuration

### Environment Variables

Configure your Umami website ID through an environment variable:

```env
# .env.local
NEXT_PUBLIC_UMAMI_WEBSITE_ID=your-website-id-here
```

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
| `websiteId` | `string` | `process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID` | Your Umami website ID |
| `src` | `string` | `https://umami.marjala.com/script.js` | The URL of your Umami script |
| `domains` | `string[]` | `undefined` | Restrict tracking to specific domains |
| `autoTrack` | `boolean` | `true` | Whether to automatically track page views |

## 🧩 Features

- 🔄 Server Component compatible
- 🔌 Easy integration with Next.js
- 🔧 Configurable via props or environment variables
- 📱 Works with App Router
- 🧠 Smart defaults
- 🪶 Lightweight with zero dependencies
- 🔒 Domain restriction support
- 🎛️ Fine-grained tracking control

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

The repository now features an improved CI/CD pipeline with automatic versioning and publishing:

1. When changes are pushed to the main branch, the Autoversion workflow runs
2. It automatically increments the version based on commit messages
3. The Trigger-Publish workflow then picks up the new tag
4. Finally, the Publish workflow creates a GitHub release and publishes the package

> Note: The pipeline has been enhanced to ensure reliable tag detection and release creation, with improved logic for handling version tags.

## 📄 License

MIT © [giof-se](https://github.com/giof-se)