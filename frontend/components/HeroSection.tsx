'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function HeroSection() {
    return (
        <section className="w-full min-h-[85vh] flex items-center overflow-hidden bg-[#1a1a1a] relative">
            {/* Subtle background grain */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(120,60,200,0.08),transparent_60%)]"></div>

            <div className="max-w-[1440px] mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-8 px-10 md:px-20 items-center relative z-10">
                {/* Left: Text Content */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="py-16"
                >
                    <p className="text-sm font-semibold text-slate-400 tracking-widest uppercase mb-6">
                        EventSphere
                    </p>

                    <h1 className="text-5xl md:text-[4.2rem] font-black text-white leading-[1.08] tracking-tight mb-3">
                        Campus events
                    </h1>
                    <h1 className="text-5xl md:text-[4.2rem] font-black leading-[1.08] tracking-tight mb-8">
                        <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
                            start here.
                        </span>
                    </h1>

                    <p className="text-lg text-slate-400 leading-relaxed max-w-md mb-10">
                        Discover workshops, hackathons, and seminars at Sahyadri College. Register in seconds and never miss what&apos;s happening on campus.
                    </p>

                    <Link
                        href="#events"
                        className="inline-flex items-center gap-2 border border-white/20 text-white font-semibold px-8 py-4 rounded-full hover:bg-white hover:text-black transition-all duration-300 text-sm tracking-wide"
                    >
                        Explore Events
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </Link>
                </motion.div>

                {/* Right: 3D Hero Art */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
                    className="relative flex items-center justify-center hidden md:flex"
                >
                    {/* Dark circle background */}
                    <div className="relative w-[480px] h-[480px]">
                        <div className="absolute inset-0 rounded-full bg-[#111111] shadow-2xl shadow-purple-900/10"></div>
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-900/20 via-transparent to-pink-900/10"></div>
                        <img
                            alt="Sahyadri College 3D Art"
                            className="relative z-10 w-full h-full object-contain p-4 drop-shadow-2xl"
                            src="/sahy.png"
                        />
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
