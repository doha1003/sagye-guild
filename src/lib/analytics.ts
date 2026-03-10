export function trackEvent(eventName: string, params?: Record<string, string>) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, params);
  }
}

export function trackClick(buttonName: string, pagePath?: string) {
  trackEvent('button_click', {
    button_name: buttonName,
    page_path: pagePath || (typeof window !== 'undefined' ? window.location.pathname : ''),
  });
}

export function trackPageView(pagePath: string) {
  trackEvent('page_view_custom', { page_path: pagePath });
}
