'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function HeroSection() {
    const [time, setTime] = useState<string>('Loading...');

    useEffect(() => {
        const updateClock = () => {
            const now = new Date();
            const options: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', weekday: 'long' };
            setTime(now.toLocaleTimeString('en-US', options));
        };
        updateClock();
        const interval = setInterval(updateClock, 60000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="w-full h-screen grid grid-cols-1 md:grid-cols-2 overflow-hidden bg-[#0d1f2d]">
            <div className="flex flex-col justify-center px-10 md:px-20 relative z-10 h-full">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="mb-8"
                >
                    <p className="text-xl text-slate-300 font-medium mb-2">What&apos;s Happening at</p>
                    <h2 className="text-6xl md:text-7xl font-black text-white leading-[1.1] mb-6 tracking-tighter drop-shadow-lg">Sahyadri<br />College</h2>
                    <div className="flex items-center gap-2 text-slate-300 font-medium mb-12 bg-black/20 w-fit px-4 py-2 rounded-full border border-white/10">
                        <span className="material-symbols-outlined text-sm">schedule</span>
                        <span>{time}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md bg-white/5 p-1.5 rounded-3xl sm:rounded-full border border-white/10 shadow-lg">
                        <Input
                            className="bg-transparent border-none outline-none focus-visible:ring-0 text-white placeholder:text-slate-400 px-6 flex-1 text-base h-12 w-full"
                            placeholder="Enter your email"
                            type="email"
                        />
                        <Button className="bg-white text-black font-bold h-12 px-8 rounded-full hover:bg-slate-200 transition-all text-sm w-full sm:w-auto">
                            Subscribe
                        </Button>
                    </div>
                </motion.div>
            </div>

            <div className="relative h-full w-full hidden md:block">
                <motion.div
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                    className="absolute inset-0 w-full h-full"
                >
                    <img
                        alt="Sahyadri Campus"
                        className="w-full h-full object-cover"
                        src="/sahy.jpg"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0d1f2d] via-[#0d1f2d]/50 to-transparent"></div>
                </motion.div>
            </div>
        </section>
    );
}
