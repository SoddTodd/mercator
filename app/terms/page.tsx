import Link from 'next/link';

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white text-stone-800">
      <div className="max-w-3xl mx-auto px-8 py-16">
        <h1 className="text-4xl italic font-semibold mb-8">Terms of Service / AGB</h1>

        <div className="space-y-8 leading-relaxed text-sm md:text-base">
          <section>
            <h2 className="text-xl font-semibold mb-3">English</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Merchant:</strong> [Full legal name], Berlin, Germany.</li>
              <li><strong>Scope:</strong> These terms apply to all orders via this online store.</li>
              <li><strong>Contract conclusion:</strong> Product listings are invitations to order; the contract is formed when order acceptance is confirmed.</li>
              <li><strong>Prices:</strong> Final prices are shown at checkout. No VAT is charged under § 19 UStG (small business scheme).</li>
              <li><strong>Payment:</strong> Payments are processed securely via Stripe.</li>
              <li><strong>Fulfillment:</strong> Production and logistics are handled by Printful.</li>
              <li><strong>Delivery:</strong> Delivery times are estimates and may vary by country and customs processes.</li>
              <li><strong>Liability:</strong> Statutory liability rights apply; liability limitations may apply where legally permitted.</li>
              <li><strong>Applicable law:</strong> German law applies, without prejudice to mandatory consumer protections in customer jurisdiction.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Deutsch</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Anbieter:</strong> [Vollständiger Name], Berlin, Deutschland.</li>
              <li><strong>Geltungsbereich:</strong> Diese Bedingungen gelten für alle Bestellungen über diesen Online-Shop.</li>
              <li><strong>Vertragsschluss:</strong> Produktdarstellungen sind unverbindlich; der Vertrag kommt mit Bestellbestätigung zustande.</li>
              <li><strong>Preise:</strong> Endpreise werden im Checkout angezeigt. Keine Umsatzsteuer gemäß § 19 UStG.</li>
              <li><strong>Zahlung:</strong> Zahlungsabwicklung über Stripe.</li>
              <li><strong>Erfüllung:</strong> Produktion und Logistik über Printful.</li>
              <li><strong>Lieferung:</strong> Lieferzeiten sind unverbindliche Schätzungen und können je nach Zielland/Zoll variieren.</li>
              <li><strong>Haftung:</strong> Es gelten die gesetzlichen Gewährleistungsrechte; Haftungsbeschränkungen nur im gesetzlich zulässigen Umfang.</li>
              <li><strong>Anwendbares Recht:</strong> Es gilt deutsches Recht unter Wahrung zwingender Verbraucherschutzvorschriften.</li>
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
