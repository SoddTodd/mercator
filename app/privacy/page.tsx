import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white text-stone-800">
      <div className="max-w-3xl mx-auto px-8 py-16">
        <h1 className="text-4xl italic font-semibold mb-8">Privacy Policy / Datenschutzerklärung</h1>

        <div className="space-y-8 leading-relaxed text-sm md:text-base">
          <section>
            <h2 className="text-xl font-semibold mb-3">English</h2>
            <p>
              This policy explains how we process personal data when you visit this store and place orders. The merchant is based in Berlin, Germany and sells to the US, EU, and UK.
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li><strong>Controller:</strong> Artem Ushan, Wisbyer Strasse 24, 10439 Berlin, Germany, info@monochrome-matters.eu.</li>
              <li><strong>Data collected:</strong> name, shipping/billing address, email, phone (if provided), order details, payment status, IP and technical logs.</li>
              <li><strong>Purposes:</strong> order fulfillment, payment processing, fraud prevention, customer support, legal compliance.</li>
              <li><strong>Legal bases (GDPR):</strong> Art. 6(1)(b) contract, Art. 6(1)(c) legal obligations, Art. 6(1)(f) legitimate interests.</li>
              <li><strong>Cookie categories:</strong> essential cookies (always active), optional analytics cookies, and optional marketing cookies.</li>
              <li><strong>Current first-party use:</strong> a strictly necessary session cookie (`admin_session`) is used for protected admin access.</li>
              <li><strong>Consent management:</strong> optional analytics/marketing cookies are controlled through the cookie banner and can be changed before activation.</li>
              <li><strong>Optional analytics tools:</strong> if enabled, analytics may be processed via Google Analytics (measurement and usage statistics).</li>
              <li><strong>Optional marketing tools:</strong> if enabled, marketing may be processed via Meta Pixel (campaign attribution and ad measurement).</li>
              <li><strong>Third-party cookies:</strong> when redirected to Stripe-hosted checkout, Stripe may use its own cookies on its domain to process payments and prevent fraud.</li>
              <li><strong>Cookie retention:</strong> consent preferences may be stored for up to 12 months, unless deleted earlier in your browser settings.</li>
              <li><strong>Processors:</strong> Stripe (payments), Printful (production and logistics), hosting/infrastructure providers.</li>
              <li><strong>International transfers:</strong> data may be transferred outside the EEA, including the US, using appropriate safeguards (e.g., SCCs).</li>
              <li><strong>Retention:</strong> order and tax records retained as required by German law; support/account data retained only as long as needed.</li>
              <li><strong>Your rights:</strong> access, rectification, deletion, restriction, portability, objection, complaint to a supervisory authority.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Deutsch</h2>
            <p>
              Diese Datenschutzerklärung erläutert, wie personenbezogene Daten beim Besuch dieses Shops und bei Bestellungen verarbeitet werden.
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li><strong>Verantwortlicher:</strong> Artem Ushan, Wisbyer Strasse 24, 10439 Berlin, Deutschland, info@monochrome-matters.eu.</li>
              <li><strong>Verarbeitete Daten:</strong> Name, Liefer-/Rechnungsadresse, E-Mail, ggf. Telefonnummer, Bestelldaten, Zahlungsstatus, IP und technische Protokolle.</li>
              <li><strong>Zwecke:</strong> Vertragsabwicklung, Zahlungsabwicklung, Betrugsprävention, Kundenservice, gesetzliche Pflichten.</li>
              <li><strong>Rechtsgrundlagen:</strong> Art. 6 Abs. 1 lit. b DSGVO, lit. c DSGVO, lit. f DSGVO.</li>
              <li><strong>Cookie-Kategorien:</strong> technisch notwendige Cookies (immer aktiv), optionale Analyse-Cookies und optionale Marketing-Cookies.</li>
              <li><strong>Aktuelle First-Party-Nutzung:</strong> für den geschützten Admin-Zugang wird ein technisch notwendiges Session-Cookie (`admin_session`) verwendet.</li>
              <li><strong>Einwilligungsverwaltung:</strong> optionale Analyse-/Marketing-Cookies werden über das Cookie-Banner gesteuert und nur nach Auswahl aktiviert.</li>
              <li><strong>Optionale Analyse-Tools:</strong> bei Einwilligung kann Google Analytics für Reichweiten- und Nutzungsstatistiken eingesetzt werden.</li>
              <li><strong>Optionale Marketing-Tools:</strong> bei Einwilligung kann Meta Pixel für Kampagnenzuordnung und Werbemessung eingesetzt werden.</li>
              <li><strong>Drittanbieter-Cookies:</strong> bei Weiterleitung zum Stripe-Checkout kann Stripe auf eigener Domain Cookies zur Zahlungsabwicklung und Betrugsprävention einsetzen.</li>
              <li><strong>Speicherdauer der Cookie-Einstellungen:</strong> Einwilligungspräferenzen können bis zu 12 Monate gespeichert werden, sofern sie nicht vorher im Browser gelöscht werden.</li>
              <li><strong>Auftragsverarbeiter:</strong> Stripe (Zahlung), Printful (Produktion/Versand), Hosting-Infrastruktur.</li>
              <li><strong>Drittlandübermittlung:</strong> Übermittlungen in Drittländer (insb. USA) können stattfinden, abgesichert durch geeignete Garantien (z. B. SCC).</li>
              <li><strong>Speicherdauer:</strong> Aufbewahrung gemäß handels- und steuerrechtlichen Pflichten; im Übrigen nur solange erforderlich.</li>
              <li><strong>Betroffenenrechte:</strong> Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit, Widerspruch, Beschwerde bei Aufsichtsbehörde.</li>
            </ul>
          </section>

        </div>

        <div className="mt-10">
          <Link href="/" className="text-sm uppercase tracking-[0.2em] font-semibold text-stone-600 hover:text-stone-900">
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
