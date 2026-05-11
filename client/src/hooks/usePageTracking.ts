import { useEffect } from 'react';
import { useLocation } from 'wouter';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function usePageTracking() {
  const [location] = useLocation();

  useEffect(() => {
    if (typeof window.gtag === 'function') {
      window.gtag('config', 'G-NFC69M5MYC', {
        page_path: location,
      });
    }
  }, [location]);
}
