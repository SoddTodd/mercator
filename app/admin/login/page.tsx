'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        setError(payload.error || 'Login failed');
        return;
      }

      router.push('/admin');
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#fdfcfb] text-[#1a1a1a] flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white border border-stone-200 rounded p-8">
        <h1 className="text-2xl italic font-semibold mb-2">Admin Login</h1>
        <p className="text-sm text-stone-500 mb-6">Enter your admin password to manage map catalog content.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="text-sm block">
            <span className="block mb-1">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-stone-300 rounded px-3 py-2"
              autoFocus
              required
            />
          </label>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-stone-900 text-white rounded text-sm uppercase tracking-wider hover:bg-stone-800 disabled:bg-stone-500"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </main>
  );
}
