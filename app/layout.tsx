import './globals.css';
import CookieConsentBanner from './components/CookieConsentBanner';
import ConsentTrackingScripts from './components/ConsentTrackingScripts';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <ConsentTrackingScripts />
        <CookieConsentBanner />
      </body>
    </html>
  );
}
