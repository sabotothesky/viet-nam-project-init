import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

export function initSentry() {
  if (import.meta.env.PROD) {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN || 'YOUR_SENTRY_DSN',
      integrations: [new BrowserTracing()],
      tracesSampleRate: 0.1,
      environment: import.meta.env.MODE,
      release: import.meta.env.VITE_APP_VERSION || '1.0.0',
      
      // Performance monitoring
      performance: true,
      
      // Error filtering
      beforeSend(event) {
        // Filter out certain errors
        if (event.exception) {
          const exception = event.exception.values?.[0];
          if (exception?.value?.includes('ResizeObserver loop limit exceeded')) {
            return null;
          }
        }
        return event;
      },
      
      // User context
      initialScope: {
        tags: {
          app: 'sabo-pool-arena-hub',
        },
      },
    });
  }
}

export { Sentry }; 