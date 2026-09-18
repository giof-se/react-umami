// src/debug.ts

// Internal: not re-exported from index. The helpers' "not loaded" warnings fire constantly
// for visitors who declined consent or block the tracker, so they only log once
// <UmamiAnalytics debug> has mounted.
let warningsEnabled = false;

export const setDebugWarnings = (enabled: boolean): void => {
  warningsEnabled = enabled;
};

export const debugWarn = (message: string): void => {
  if (warningsEnabled) {
    console.warn(message);
  }
};
