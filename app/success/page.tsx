import Link from 'next/link';

export default function SuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen font-sans bg-[#fcfaf7]">
      <h1 className="text-3xl italic">Payment Received!</h1>
      <p className="mt-4">Your order is being sent to Printful.</p>

      <div className="mt-10 md:mt-14 text-[10px] uppercase tracking-[0.2em] font-semibold text-stone-500">
        <ul className="list-none m-0 p-0 flex flex-wrap justify-center items-center gap-y-2 md:gap-y-4">
          <li className="flex items-center py-1">
            <Link href="/terms" className="hover:text-stone-900 transition-colors duration-300">
              Terms
            </Link>
            <span className="inline-block mx-2 md:mx-4 opacity-60">•</span>
          </li>
          <li className="flex items-center py-1">
            <Link href="/privacy" className="hover:text-stone-900 transition-colors duration-300">
              Privacy
            </Link>
            <span className="inline-block mx-2 md:mx-4 opacity-60">•</span>
          </li>
          <li className="flex items-center py-1">
            <Link href="/shipping" className="hover:text-stone-900 transition-colors duration-300">
              Shipping
            </Link>
            <span className="inline-block mx-2 md:mx-4 opacity-60">•</span>
          </li>
          <li className="flex items-center py-1">
            <Link href="/returns" className="hover:text-stone-900 transition-colors duration-300">
              Returns
            </Link>
          </li>
        </ul>
      </div>

      <Link href="/" className="mt-10 md:mt-14 underline text-sm opacity-60 hover:opacity-100 transition-opacity">
        Return to shop
      </Link>
    </div>
  );
}