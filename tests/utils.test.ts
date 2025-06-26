// tests/utils.test.ts

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { trackEvent, trackPageView, isUmamiLoaded, getUmami } from '../src/utils';

describe('Utils', () => {
  beforeEach(() => {
    // Clear window.umami before each test
    delete (window as any).umami;
    vi.clearAllMocks();
  });

  describe('trackEvent', () => {
    it('tracks event when umami is loaded', () => {
      const mockTrack = vi.fn();
      window.umami = { track: mockTrack };

      trackEvent('test-event', { key: 'value' });

      expect(mockTrack).toHaveBeenCalledWith('test-event', { key: 'value' });
    });

    it('warns when umami is not loaded', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      trackEvent('test-event');

      expect(consoleSpy).toHaveBeenCalledWith('trackEvent: Umami not loaded yet');
      consoleSpy.mockRestore();
    });

    it('warns in server environment', () => {
      const originalWindow = global.window;
      delete (global as any).window;
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      trackEvent('test-event');

      expect(consoleSpy).toHaveBeenCalledWith('trackEvent: Not in browser environment');
      
      global.window = originalWindow;
      consoleSpy.mockRestore();
    });
  });

  describe('trackPageView', () => {
    it('tracks page view with path and title', () => {
      const mockTrack = vi.fn();
      window.umami = { track: mockTrack };

      trackPageView('/test-path', 'Test Title');

      expect(mockTrack).toHaveBeenCalledWith('pageview', {
        path: '/test-path',
        title: 'Test Title',
      });
    });

    it('tracks page view without parameters', () => {
      const mockTrack = vi.fn();
      window.umami = { track: mockTrack };

      trackPageView();

      expect(mockTrack).toHaveBeenCalledWith('pageview', {});
    });
  });

  describe('isUmamiLoaded', () => {
    it('returns true when umami is loaded', () => {
      window.umami = { track: vi.fn() };

      expect(isUmamiLoaded()).toBe(true);
    });

    it('returns false when umami is not loaded', () => {
      expect(isUmamiLoaded()).toBe(false);
    });

    it('returns false in server environment', () => {
      const originalWindow = global.window;
      delete (global as any).window;

      expect(isUmamiLoaded()).toBe(false);

      global.window = originalWindow;
    });
  });

  describe('getUmami', () => {
    it('returns umami instance when available', () => {
      const mockUmami = { track: vi.fn() };
      window.umami = mockUmami;

      expect(getUmami()).toBe(mockUmami);
    });

    it('returns undefined when umami is not loaded', () => {
      expect(getUmami()).toBeUndefined();
    });

    it('returns undefined in server environment', () => {
      const originalWindow = global.window;
      delete (global as any).window;

      expect(getUmami()).toBeUndefined();

      global.window = originalWindow;
    });
  });
});