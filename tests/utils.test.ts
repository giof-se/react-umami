// tests/utils.test.ts

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getUmami, isUmamiLoaded, trackEvent, trackPageView } from '../src/utils';

describe('Utils', () => {
  beforeEach(() => {
    // Clear window.umami before each test
    (window as { umami?: unknown }).umami = undefined;
    vi.clearAllMocks();
  });

  describe('trackEvent', () => {
    it('tracks event when umami is loaded', () => {
      const mockTrack = vi.fn();
      window.umami = { track: mockTrack };

      trackEvent('test_event', { param: 'value' });

      expect(mockTrack).toHaveBeenCalledWith('test_event', { param: 'value' });
    });

    it('warns when umami is not loaded', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      trackEvent('test_event');

      expect(consoleSpy).toHaveBeenCalledWith('trackEvent: Umami not loaded yet');
      consoleSpy.mockRestore();
    });

    it('warns in server environment', () => {
      const originalWindow = global.window;
      (global as { window?: unknown }).window = undefined;
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      trackEvent('test_event');

      expect(consoleSpy).toHaveBeenCalledWith('trackEvent: Not in browser environment');
      consoleSpy.mockRestore();
      global.window = originalWindow;
    });
  });

  describe('trackPageView', () => {
    it('tracks page view with path and title', () => {
      const mockTrack = vi.fn();
      window.umami = { track: mockTrack };

      trackPageView('/test', 'Test Page');

      expect(mockTrack).toHaveBeenCalledWith('pageview', { path: '/test', title: 'Test Page' });
    });

    it('tracks page view with empty data when no params provided', () => {
      const mockTrack = vi.fn();
      window.umami = { track: mockTrack };

      trackPageView();

      expect(mockTrack).toHaveBeenCalledWith('pageview', {});
    });

    it('warns when umami is not loaded', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      trackPageView('/test');

      expect(consoleSpy).toHaveBeenCalledWith('trackPageView: Umami not loaded yet');
      consoleSpy.mockRestore();
    });

    it('warns in server environment', () => {
      const originalWindow = global.window;
      (global as { window?: unknown }).window = undefined;
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      trackPageView('/test');

      expect(consoleSpy).toHaveBeenCalledWith('trackPageView: Not in browser environment');
      consoleSpy.mockRestore();
      global.window = originalWindow;
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
      (global as { window?: unknown }).window = undefined;

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
      (global as { window?: unknown }).window = undefined;

      expect(getUmami()).toBeUndefined();

      global.window = originalWindow;
    });
  });
});
