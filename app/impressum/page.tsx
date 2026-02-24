import Link from 'next/link';

export default function ImpressumPage() {
  return (
    <main className="min-h-screen bg-white text-stone-800">
      <div className="max-w-3xl mx-auto px-8 py-16">
        <h1 className="text-4xl italic font-semibold mb-8">Impressum / Legal Notice</h1>

        <div className="space-y-8 leading-relaxed text-sm md:text-base">
          <section>
            <h2 className="text-xl font-semibold mb-3">Deutsch</h2>
            <p>
              Angaben gemäß § 5 TMG
              <br />
              Artem Ushan
              <br />
              Monochrome Matters
              <br />
              Wisbyer Strasse 24
              <br />
              10439 Berlin, Deutschland
            </p>
            <p className="mt-4">
              Kontakt
              <br />
              E-Mail: info@monochrome-matters.eu
            </p>
            <p className="mt-4">
              Rechtsform: Einzelunternehmen (Kleinunternehmer)
              <br />
              Umsatzsteuer: Keine Ausweisung der Umsatzsteuer gemäß § 19 UStG.
            </p>
            <p className="mt-4">
              Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV:
              <br />
              Artem Ushan, Wisbyer Strasse 24, 10439 Berlin, Deutschland
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">English</h2>
            <p>
              Information according to German legal notice requirements (§ 5 TMG)
              <br />
              Artem Ushan
              <br />
              Monochrome Matters
              <br />
              Wisbyer Strasse 24
              <br />
              10439 Berlin, Germany
            </p>
            <p className="mt-4">
              Contact
              <br />
              Email: info@monochrome-matters.eu
            </p>
            <p className="mt-4">
              Legal form: Sole proprietor (small business under German law)
              <br />
              VAT: No VAT charged under § 19 German VAT Act (UStG).
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
