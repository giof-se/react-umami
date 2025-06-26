// src/types.ts

export interface UmamiEventData {
  [key: string]: string | number | boolean | null | undefined;
}

export interface UmamiTracker {
  track: (eventName: string, eventData?: UmamiEventData) => void;
  identify?: (id: string) => void;
}

declare global {
  interface Window {
    umami?: UmamiTracker;
  }
}
