'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  CookieConsentPreferences,
  getDefaultCookieConsent,
  getStoredCookieConsent,
  saveCookieConsent,
} from '../../lib/cookie-consent';

export default function CookieConsentBanner() {
  const [isReady, setIsReady] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    setIsReady(true);
    const existing = getStoredCookieConsent();
    if (!existing) {
      const defaults = getDefaultCookieConsent();
      setAnalytics(defaults.analytics);
      setMarketing(defaults.marketing);
      setIsVisible(true);
      return;
    }

    setAnalytics(existing.analytics);
    setMarketing(existing.marketing);
  }, []);

  function applyConsent(next: Partial<CookieConsentPreferences>) {
    saveCookieConsent(next);
    setIsVisible(false);
    setIsCustomizeOpen(false);
  }

  if (!isReady) return null;

  if (!isVisible) {
    return (
      <button
        onClick={() => {
          const existing = getStoredCookieConsent() ?? getDefaultCookieConsent();
          setAnalytics(existing.analytics);
          setMarketing(existing.marketing);
          setIsCustomizeOpen(true);
          setIsVisible(true);
        }}
        className="fixed bottom-4 right-4 z-[190] px-3 py-2 text-[10px] uppercase tracking-[0.15em] border border-stone-300 rounded bg-white text-stone-700 shadow hover:bg-stone-100"
      >
        Cookie settings
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[200] md:left-auto md:max-w-md">
      <div className="rounded-lg border border-stone-300 bg-white shadow-2xl p-4 md:p-5">
        <p className="text-xs uppercase tracking-[0.2em] text-stone-500 mb-2">Cookie preferences</p>
        <h2 className="text-lg font-semibold text-stone-900 mb-2">We respect your privacy</h2>
        <p className="text-sm text-stone-600 leading-relaxed">
          We use essential cookies for secure admin access. Optional analytics and marketing cookies can be enabled now or later.
          See our{' '}
          <Link href="/privacy" className="underline underline-offset-2 text-stone-800 hover:text-black">
            Privacy Policy
          </Link>
          .
        </p>

        {isCustomizeOpen && (
          <div className="mt-4 border-t border-stone-200 pt-4 space-y-3">
            <label className="flex items-start gap-3 text-sm text-stone-700">
              <input type="checkbox" checked disabled className="mt-1" />
              <span>
                <strong>Essential</strong> (always on): security and session handling.
              </span>
            </label>
            <label className="flex items-start gap-3 text-sm text-stone-700">
              <input
                type="checkbox"
                checked={analytics}
                onChange={(e) => setAnalytics(e.target.checked)}
                className="mt-1"
              />
              <span>
                <strong>Analytics</strong>: anonymous traffic and performance insights.
              </span>
            </label>
            <label className="flex items-start gap-3 text-sm text-stone-700">
              <input
                type="checkbox"
                checked={marketing}
                onChange={(e) => setMarketing(e.target.checked)}
                className="mt-1"
              />
              <span>
                <strong>Marketing</strong>: ad and campaign tracking.
              </span>
            </label>
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => applyConsent({ analytics: true, marketing: true })}
            className="px-3 py-2 text-xs uppercase tracking-[0.14em] rounded bg-stone-900 text-white hover:bg-stone-800"
          >
            Accept all
          </button>
          <button
            onClick={() => applyConsent({ analytics: false, marketing: false })}
            className="px-3 py-2 text-xs uppercase tracking-[0.14em] rounded border border-stone-300 text-stone-800 hover:bg-stone-100"
          >
            Reject optional
          </button>
          {isCustomizeOpen ? (
            <button
              onClick={() => applyConsent({ analytics, marketing })}
              className="px-3 py-2 text-xs uppercase tracking-[0.14em] rounded border border-stone-300 text-stone-800 hover:bg-stone-100"
            >
              Save choices
            </button>
          ) : (
            <button
              onClick={() => setIsCustomizeOpen(true)}
              className="px-3 py-2 text-xs uppercase tracking-[0.14em] rounded border border-stone-300 text-stone-800 hover:bg-stone-100"
            >
              Customize
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
