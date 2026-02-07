"use client";

import Script from "next/script";

const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || "G-XXXXXXXXXX";

export default function GoogleAnalytics() {
  // Don't render in development unless GA ID is set
  if (!process.env.NEXT_PUBLIC_GA_ID && process.env.NODE_ENV === "development") {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_TRACKING_ID}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
    </>
  );
}

// Helper function to track events
export function trackEvent(action: string, category: string, label?: string, value?: number) {
  if (typeof window !== "undefined" && (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag) {
    (window as unknown as { gtag: (...args: unknown[]) => void }).gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
}

// Common tracking functions for the site
export const analytics = {
  // Track WhatsApp button clicks
  trackWhatsAppClick: (location: string) => {
    trackEvent("click", "WhatsApp", location);
  },

  // Track service page views
  trackServiceView: (serviceName: string) => {
    trackEvent("view", "Service", serviceName);
  },

  // Track zone inquiries
  trackZoneInquiry: (zoneName: string) => {
    trackEvent("inquiry", "Zone", zoneName);
  },

  // Track language changes
  trackLanguageChange: (newLocale: string) => {
    trackEvent("change", "Language", newLocale);
  },

  // Track phone calls
  trackPhoneCall: () => {
    trackEvent("click", "Phone", "call_button");
  },

  // Track social media clicks
  trackSocialClick: (platform: string) => {
    trackEvent("click", "Social", platform);
  },
};
