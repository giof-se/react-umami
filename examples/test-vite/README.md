# Vite + React + Umami Analytics Example

This example demonstrates how to integrate `@giof/react-umami` with a Vite + React application.

## Features Demonstrated

- ✅ **UmamiAnalytics Component**: Automatic script injection and page tracking
- ✅ **useUmami Hook**: Custom event tracking from React components
- ✅ **trackEvent Utility**: Standalone event tracking function
- ✅ **Development Mode**: Dry-run and debug modes for development
- ✅ **TypeScript Support**: Full type safety and IntelliSense
- ✅ **Vite Environment Variables**: Proper configuration with VITE_ prefix

## Quick Start

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your Umami website ID
   ```

3. **Start development server:**
   ```bash
   pnpm dev
   ```

4. **Open your browser and test:**
   - Navigate to `http://localhost:5173`
   - Open browser developer console
   - Select "Dry Run Mode" to see event logging
   - Click the test buttons to see events in console

## Environment Variables

Vite requires the `VITE_` prefix for environment variables to be accessible in the browser:

```env
# .env.local
VITE_UMAMI_WEBSITE_ID=your-website-id-here
VITE_UMAMI_SCRIPT_URL=https://your-umami-instance.com/script.js
```

## Usage Examples

### Basic Analytics Component

```tsx
import { UmamiAnalytics } from '@giof/react-umami';

function App() {
  return (
    <div>
      <UmamiAnalytics
        websiteId="your-website-id"
        dryRun={import.meta.env.DEV} // Dry run in development
        debug={import.meta.env.DEV}  // Debug logging in development
      />
      {/* Your app content */}
    </div>
  );
}
```

### Custom Event Tracking with Hook

```tsx
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

### Utility Function Tracking

```tsx
import { trackEvent } from '@giof/react-umami';

// Can be called from anywhere
trackEvent('user_action', {
  action: 'download',
  file: 'whitepaper.pdf'
});
```

## Development vs Production

### Development Mode (Recommended)
- **Dry Run**: Events logged to console, not sent to Umami
- **Debug Logging**: Verbose output for troubleshooting
- **Clean Data**: No test events in production analytics

### Production Mode
- **Real Tracking**: Events sent to Umami servers
- **Clean Console**: No debug output
- **Optimized Performance**: Minimal overhead

## Framework Integration

This example shows Vite-specific patterns:

- **Environment Variables**: Using `VITE_` prefix
- **Import Meta**: Using `import.meta.env` instead of `process.env`
- **ES Modules**: Full ESM support with Vite
- **Hot Module Replacement**: Works seamlessly with Vite's HMR

## Troubleshooting

### Common Issues

**Events not tracking:**
- Check browser console for errors
- Verify environment variables are set correctly
- Ensure website ID matches your Umami instance

**TypeScript errors:**
- Make sure `@giof/react-umami` is installed
- Check that types are being resolved correctly

**Build errors:**
- Verify all dependencies are installed
- Check that environment variables use `VITE_` prefix

## Build and Deploy

```bash
# Build for production
pnpm build

# Preview production build
pnpm preview
```

The built files will be in the `dist/` directory, ready for deployment to any static hosting service.

## Learn More

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [@giof/react-umami Documentation](../../README.md)
- [Umami Analytics](https://umami.is/)
