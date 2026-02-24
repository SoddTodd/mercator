import Link from 'next/link';

export default function WithdrawalPage() {
  return (
    <main className="min-h-screen bg-white text-stone-800">
      <div className="max-w-3xl mx-auto px-8 py-16">
        <h1 className="text-4xl italic font-semibold mb-8">Right of Withdrawal / Widerrufsbelehrung</h1>

        <div className="space-y-8 leading-relaxed text-sm md:text-base">
          <section>
            <h2 className="text-xl font-semibold mb-3">English (EU/UK consumers)</h2>
            <p>
              You have the right to withdraw from this contract within 14 days without giving any reason, unless a statutory exception applies.
            </p>
            <p className="mt-4">
              The withdrawal period is 14 days from the day on which you, or a third party named by you, receives the goods.
            </p>
            <p className="mt-4">
              To exercise withdrawal, inform us at:
              <br />
              Artem Ushan
              <br />
              Wisbyer Strasse 24, 10439 Berlin, Germany
              <br />
              info@monochrome-matters.eu
            </p>
            <p className="mt-4">
              We reimburse all payments received, including standard delivery costs, without undue delay and no later than 14 days after receiving your withdrawal notice, using the same payment method unless agreed otherwise.
            </p>
            <p className="mt-4">
              <strong>Exception:</strong> The right of withdrawal may not apply to goods made to customer specifications or clearly personalized.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Deutsch</h2>
            <p>
              Verbraucher haben das Recht, diesen Vertrag binnen 14 Tagen ohne Angabe von Gründen zu widerrufen, soweit keine gesetzliche Ausnahme greift.
            </p>
            <p className="mt-4">
              Die Widerrufsfrist beträgt 14 Tage ab dem Tag, an dem du oder ein von dir benannter Dritter die Ware erhalten hast.
            </p>
            <p className="mt-4">
              Zur Ausübung des Widerrufs richte deine Erklärung an:
              <br />
              Artem Ushan
              <br />
              Wisbyer Strasse 24, 10439 Berlin, Deutschland
              <br />
              info@monochrome-matters.eu
            </p>
            <p className="mt-4">
              Wir erstatten alle Zahlungen einschließlich Standard-Lieferkosten unverzüglich und spätestens binnen 14 Tagen ab Eingang der Widerrufserklärung, unter Verwendung desselben Zahlungsmittels, sofern nichts anderes vereinbart wurde.
            </p>
            <p className="mt-4">
              <strong>Ausnahme:</strong> Das Widerrufsrecht kann bei kundenspezifisch angefertigten oder eindeutig personalisierten Produkten ausgeschlossen sein.
            </p>
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
