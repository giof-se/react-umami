// src/types.ts

export interface UmamiTracker {
  track: (eventName: string, eventData?: Record<string, any>) => void;
  identify?: (id: string) => void;
}

declare global {
  interface Window {
    umami?: UmamiTracker;
  }
}

export {};