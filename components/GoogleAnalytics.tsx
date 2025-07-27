"use client";

import Script from 'next/script';
import { useEffect } from 'react';

// Add type declaration for the gtag function
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export default function GoogleAnalytics() {
  const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-DJ9XHX8BJT';
  
  useEffect(() => {
    console.log('Google Analytics - Component mounted with ID:', GA_MEASUREMENT_ID);
    
    // This helps verify the script is loaded correctly
    const checkGtag = setInterval(() => {
      if (typeof window.gtag === 'function') {
        console.log('Google Analytics - gtag function is available');
        clearInterval(checkGtag);
      }
    }, 500);
    
    return () => clearInterval(checkGtag);
  }, [GA_MEASUREMENT_ID]);
  
  if (!GA_MEASUREMENT_ID) {
    console.error('Google Analytics - Measurement ID is not set');
    return null;
  }
  
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
        onLoad={() => {
          console.log('Google Analytics - Script loaded successfully');
        }}
        onError={(e) => {
          console.error('Google Analytics - Failed to load script', e);
        }}
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          console.log('Google Analytics - Initializing...');
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_path: window.location.pathname,
            send_page_view: true
          });
          console.log('Google Analytics - Initialized with ID: ${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  );
}
