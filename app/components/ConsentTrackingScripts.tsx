'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';
import { getStoredCookieConsent } from '../../lib/cookie-consent';

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
    fbq: (...args: unknown[]) => void;
    _fbq?: (...args: unknown[]) => void;
  }
}

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || '';
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim() || '';

type ConsentState = {
  analytics: boolean;
  marketing: boolean;
};

function getConsentState(): ConsentState {
  const consent = getStoredCookieConsent();
  return {
    analytics: Boolean(consent?.analytics),
    marketing: Boolean(consent?.marketing),
  };
}

export default function ConsentTrackingScripts() {
  const [consentState, setConsentState] = useState<ConsentState>({ analytics: false, marketing: false });

  useEffect(() => {
    setConsentState(getConsentState());

    const onConsentUpdated = () => {
      setConsentState(getConsentState());
    };

    window.addEventListener('cookie-consent-updated', onConsentUpdated);
    return () => {
      window.removeEventListener('cookie-consent-updated', onConsentUpdated);
    };
  }, []);

  return (
    <>
      {GA_MEASUREMENT_ID && consentState.analytics && (
        <>
          <Script
            id="ga-loader"
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            strategy="afterInteractive"
          />
          <Script
            id="ga-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                window.gtag = gtag;
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}', {
                  anonymize_ip: true
                });
              `,
            }}
          />
        </>
      )}

      {META_PIXEL_ID && consentState.marketing && (
        <>
          <Script
            id="meta-pixel"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${META_PIXEL_ID}');
                fbq('track', 'PageView');
              `,
            }}
          />
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: 'none' }}
              src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        </>
      )}
    </>
  );
}
