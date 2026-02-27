'use client';
import { useState } from 'react';
import { adminLogin } from '@/lib/api';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await adminLogin(email, password);
            if (res.ok) {
                const data = await res.json();
                const token = data.access_token;
                localStorage.setItem('admin_token', token);
                document.cookie = `admin_token=${token}; path=/; max-age=86400`;
                window.location.href = '/admin/dashboard';
            } else {
                setError('Invalid credentials');
            }
        } catch {
            setError('An error occurred while logging in.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#0f0f0f] p-6 w-full">
            <div className="w-full max-w-md bg-[#1a1a1a] rounded-[2.5rem] p-10 shadow-2xl border border-white/5 text-center mx-auto">
                <h2 className="text-3xl font-bold text-white mb-2">EventSphere</h2>
                <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-10">Admin Access Only</p>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl mb-6 text-sm font-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <input
                        type="text"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        disabled={loading}
                        className="w-full bg-[#0f0f0f] border border-white/10 rounded-xl px-5 py-4 text-white placeholder-slate-600 focus:border-[#135bec] focus:ring-0 transition-all outline-none"
                        placeholder="Username or Email"
                    />
                    <input
                        type="password"
                        required
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        disabled={loading}
                        className="w-full bg-[#0f0f0f] border border-white/10 rounded-xl px-5 py-4 text-white placeholder-slate-600 focus:border-[#135bec] focus:ring-0 transition-all outline-none"
                        placeholder="Password"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-white text-black font-bold py-4 rounded-full mt-4 hover:bg-slate-200 transition-all disabled:opacity-50"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
}
