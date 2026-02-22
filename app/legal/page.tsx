import Link from 'next/link';

const legalLinks = [
  { href: '/impressum', label: 'Impressum' },
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Service' },
  { href: '/shipping', label: 'Shipping Policy' },
  { href: '/returns', label: 'Returns & Refunds' },
  { href: '/withdrawal', label: 'Right of Withdrawal' },
];

export default function LegalPage() {
  return (
    <main className="min-h-screen bg-white text-stone-800">
      <div className="max-w-3xl mx-auto px-8 py-16">
        <h1 className="text-4xl italic font-semibold mb-8">Legal Center</h1>
        <p className="text-stone-600 mb-8">
          Important legal and policy information for this store.
        </p>

        <ul className="space-y-3 text-sm uppercase tracking-[0.1em] font-semibold text-stone-700">
          {legalLinks.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="inline-flex items-center hover:text-stone-900 transition-colors duration-200"
                style={{ textDecoration: 'none' }}
              >
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-10">
          <Link href="/" className="text-sm uppercase tracking-[0.2em] font-semibold text-stone-600 hover:text-stone-900">
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
