'use client';
import { useState } from 'react';
import { registerForEvent } from '../lib/api';

export default function RegistrationForm({ eventId, spotsLeft }: { eventId: string | number, spotsLeft: number }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'full' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        try {
            const res = await registerForEvent({ event_id: eventId, name, email });
            if (res.status === 201) {
                setStatus('success');
            } else if (res.status === 400) {
                setStatus('full');
            } else {
                setStatus('error');
            }
        } catch {
            setStatus('error');
        }
    };

    if (status === 'success') {
        return (
            <div className="registration-card p-10 bg-[#1a1a1a] rounded-[2.5rem] border border-emerald-500/30 shadow-2xl flex flex-col items-center justify-center text-center space-y-4">
                <span className="material-symbols-outlined text-6xl text-emerald-500">check_circle</span>
                <h3 className="text-2xl font-bold text-white">Registration Successful!</h3>
                <p className="text-slate-400">We&apos;ve sent the details to {email}. See you there!</p>
            </div>
        );
    }

    return (
        <div className="registration-card p-10 bg-[#1a1a1a] rounded-[2.5rem] border border-white/10 shadow-2xl">
            <div className="flex justify-between items-center mb-10">
                <h3 className="text-2xl font-bold">Registration</h3>
                <div className="flex items-center gap-2 text-[#135bec] bg-[#135bec]/10 px-4 py-2 rounded-full">
                    <span className="material-symbols-outlined text-[18px]">person_add</span>
                    <span className="text-sm font-bold">{spotsLeft} spots left</span>
                </div>
            </div>

            {status === 'full' && (
                <div className="bg-amber-500/10 text-amber-500 p-4 rounded-xl mb-6 text-sm font-semibold border border-amber-500/20">
                    Sorry, this event is currently full.
                </div>
            )}

            {status === 'error' && (
                <div className="bg-red-500/10 text-red-500 p-4 rounded-xl mb-6 text-sm font-semibold border border-red-500/20">
                    An error occurred. Please try again.
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-3 px-1">Full Name</label>
                    <input
                        required
                        value={name}
                        onChange={e => setName(e.target.value)}
                        disabled={status === 'loading'}
                        className="w-full bg-[#0f0f0f] border-white/10 focus:border-[#135bec] focus:ring-0 rounded-xl px-5 py-4 text-white placeholder-slate-600 transition-all outline-none"
                        placeholder="Enter your full name"
                        type="text"
                    />
                </div>
                <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-3 px-1">Email Address</label>
                    <input
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        disabled={status === 'loading'}
                        className="w-full bg-[#0f0f0f] border-white/10 focus:border-[#135bec] focus:ring-0 rounded-xl px-5 py-4 text-white placeholder-slate-600 transition-all outline-none"
                        placeholder="example@sahyadri.edu.in"
                        type="email"
                    />
                </div>
                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={status === 'loading' || spotsLeft <= 0}
                        className="w-full bg-white hover:bg-slate-200 text-[#0f0f0f] font-bold py-5 rounded-xl transition-all shadow-xl active:scale-[0.98] text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {status === 'loading' ? 'Registering...' : 'Register Now'}
                    </button>
                </div>
                <p className="text-center text-slate-500 text-xs mt-4">
                    By registering, you agree to our event terms and conditions.
                </p>
            </form>
        </div>
    );
}
