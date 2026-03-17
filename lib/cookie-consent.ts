export const COOKIE_CONSENT_COOKIE_NAME = 'cookie_consent';
const COOKIE_CONSENT_STORAGE_KEY = 'cookie_consent_v1';

export type CookieConsentPreferences = {
  essential: true;
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
  version: 1;
};

function buildDefaultConsent(): CookieConsentPreferences {
  return {
    essential: true,
    analytics: false,
    marketing: false,
    updatedAt: new Date().toISOString(),
    version: 1,
  };
}

function normalizeConsent(input: Partial<CookieConsentPreferences>): CookieConsentPreferences {
  return {
    essential: true,
    analytics: Boolean(input.analytics),
    marketing: Boolean(input.marketing),
    updatedAt: input.updatedAt || new Date().toISOString(),
    version: 1,
  };
}

function encodeConsent(consent: CookieConsentPreferences): string {
  return encodeURIComponent(JSON.stringify(consent));
}

function decodeConsent(raw: string): CookieConsentPreferences | null {
  try {
    const parsed = JSON.parse(decodeURIComponent(raw)) as Partial<CookieConsentPreferences>;
    return normalizeConsent(parsed);
  } catch {
    return null;
  }
}

function getCookieValue(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = document.cookie.match(new RegExp(`(?:^|; )${escapedName}=([^;]*)`));
  return match?.[1] ?? null;
}

function writeCookie(name: string, value: string, maxAgeSeconds: number) {
  if (typeof document === 'undefined') return;
  const secure = typeof window !== 'undefined' && window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${name}=${value}; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Lax${secure}`;
}

export function getStoredCookieConsent(): CookieConsentPreferences | null {
  if (typeof window !== 'undefined') {
    try {
      const fromStorage = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
      if (fromStorage) {
        const parsed = JSON.parse(fromStorage) as Partial<CookieConsentPreferences>;
        return normalizeConsent(parsed);
      }
    } catch {
    }
  }

  const cookieValue = getCookieValue(COOKIE_CONSENT_COOKIE_NAME);
  if (!cookieValue) return null;
  return decodeConsent(cookieValue);
}

export function saveCookieConsent(input: Partial<CookieConsentPreferences>) {
  const consent = normalizeConsent(input);

  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, JSON.stringify(consent));
    } catch {
    }
  }

  writeCookie(COOKIE_CONSENT_COOKIE_NAME, encodeConsent(consent), 60 * 60 * 24 * 365);

  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('cookie-consent-updated', {
        detail: consent,
      })
    );
  }

  return consent;
}

export function getDefaultCookieConsent() {
  return buildDefaultConsent();
}

export function hasCookieConsentFor(category: 'analytics' | 'marketing'): boolean {
  const consent = getStoredCookieConsent();
  if (!consent) return false;
  return category === 'analytics' ? consent.analytics : consent.marketing;
}
