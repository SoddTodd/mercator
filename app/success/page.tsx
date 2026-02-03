export default function SuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen font-sans bg-[#fcfaf7]">
      <h1 className="text-3xl italic">Payment Received!</h1>
      <p className="mt-4">Your order is being sent to Printful.</p>
      <a href="/" className="mt-8 underline text-sm opacity-60">Return to shop</a>
    </div>
  );
}