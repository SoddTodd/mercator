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
