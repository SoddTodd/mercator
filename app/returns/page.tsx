import Link from 'next/link';

export default function ReturnsPage() {
  return (
    <main className="min-h-screen bg-white text-stone-800">
      <div className="max-w-3xl mx-auto px-8 py-16">
        <h1 className="text-4xl italic font-semibold mb-8">Returns & Refunds / Rückgabe & Erstattung</h1>

        <div className="space-y-8 leading-relaxed text-sm md:text-base">
          <section>
            <h2 className="text-xl font-semibold mb-3">English</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>If an item arrives defective, damaged, or incorrect, contact [support email] within [X] days with photos and order number.</li>
              <li>Where legally required, refunds are issued to the original payment method after validation.</li>
              <li>For non-defective returns, your statutory withdrawal rights (EU/UK consumers) apply unless a legal exception applies.</li>
              <li>Custom/personalized products may be excluded from cancellation/return where permitted by law.</li>
              <li>Refund processing time depends on payment provider (Stripe/card issuer) after approval.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Deutsch</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Bei mangelhafter, beschädigter oder falscher Ware kontaktiere [Support-E-Mail] innerhalb von [X] Tagen mit Fotos und Bestellnummer.</li>
              <li>Soweit gesetzlich vorgesehen, erfolgt die Erstattung nach Prüfung über das ursprüngliche Zahlungsmittel.</li>
              <li>Für nicht mangelhafte Rücksendungen gelten die gesetzlichen Widerrufsrechte (EU/UK), soweit keine Ausnahme greift.</li>
              <li>Personalisierte oder auf Bestellung gefertigte Produkte können vom Widerruf ausgeschlossen sein, soweit rechtlich zulässig.</li>
              <li>Die Dauer der Rückzahlung hängt nach Freigabe vom Zahlungsdienstleister (Stripe/Kartenanbieter) ab.</li>
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
