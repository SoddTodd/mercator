import Link from 'next/link';

export default function ShippingPage() {
  return (
    <main className="min-h-screen bg-white text-stone-800">
      <div className="max-w-3xl mx-auto px-8 py-16">
        <h1 className="text-4xl italic font-semibold mb-8">Shipping Policy / Versand</h1>

        <div className="space-y-8 leading-relaxed text-sm md:text-base">
          <section>
            <h2 className="text-xl font-semibold mb-3">English</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Orders are fulfilled by Printful and shipped to destinations currently supported by Printful.</li>
              <li>Production time and delivery time are shown at checkout as estimates.</li>
              <li>Shipping costs are displayed before payment is completed.</li>
              <li>For international shipments, customs duties/import taxes may apply depending on destination law.</li>
              <li>Risk transfer and statutory consumer protections apply according to applicable law.</li>
              <li>If your parcel is delayed, lost, or damaged, contact us at info@monochrome-matters.eu with your order number.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Deutsch</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Bestellungen werden über Printful produziert und an Ziele versendet, die aktuell von Printful unterstützt werden.</li>
              <li>Produktions- und Lieferzeiten werden im Checkout als Schätzung angezeigt.</li>
              <li>Versandkosten werden vor Abschluss der Zahlung transparent dargestellt.</li>
              <li>Bei internationalen Sendungen können je nach Zielland Zoll-/Einfuhrabgaben anfallen.</li>
              <li>Gefahrübergang und zwingende Verbraucherschutzrechte richten sich nach anwendbarem Recht.</li>
              <li>Bei Verzögerung, Verlust oder Transportschaden kontaktiere uns unter info@monochrome-matters.eu mit deiner Bestellnummer.</li>
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
