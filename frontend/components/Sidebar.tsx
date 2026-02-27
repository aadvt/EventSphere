'use client';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Sidebar() {
    return (
        <motion.aside
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="col-span-4 space-y-8 hidden md:block"
        >
            <div className="sticky top-28 space-y-8">
                <div className="bg-[#1a1a1a] rounded-3xl p-8 border border-white/5 shadow-2xl">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center p-2 mb-6">
                        <img
                            alt="Logo"
                            className="w-full h-full object-contain"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD9lI5F-07hJut_3nTC8P8A3P_Wh_-tv3g1_BW05SQ6NGE-NifixTAeZWoMyIju3Ozfxbeo4YYEKAzlf-pN7XW3ktzf8Hn3qOOH077GKD6kxVuDX7horzxifYT-uYu-ppcdmq1kWY0R5Bym3hTt3nqGUzQyuUxXDBMT7A04a_zkeMoAX1sIY3dVlq-S_Uy471UZkbcDlLHriOYgKKHsuD5e0IrHB2qyqBJoZ_G7TUGXy6KZ-VP2Rgc45MGcCbN99iKwk40QQFXtcja6"
                        />
                    </div>
                    <h5 className="text-xl font-bold text-white mb-4">Sahyadri College</h5>
                    <p className="text-slate-400 text-sm leading-relaxed mb-8">
                        The premier technical and management institute in coastal Karnataka, fostering innovation, leadership, and a vibrant student culture through diverse campus events.
                    </p>
                    <div className="space-y-4">
                        <p className="text-xs font-bold text-white uppercase tracking-widest">Get Updates</p>
                        <div className="space-y-3">
                            <Input
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 h-12 text-sm text-white focus-visible:border-white focus-visible:ring-0 transition-all outline-none"
                                placeholder="Email address"
                                type="email"
                            />
                            <Button className="w-full bg-white text-black font-bold h-12 rounded-xl hover:bg-slate-200 transition-all text-sm">
                                Subscribe for News
                            </Button>
                        </div>
                    </div>
                </div>
                <motion.div
                    whileHover={{ y: -5 }}
                    className="bg-[#1a1a1a] rounded-3xl border border-white/5 overflow-hidden shadow-2xl transition-all"
                >
                    <div className="p-6 border-b border-white/5">
                        <h5 className="text-sm font-bold text-white uppercase tracking-widest">Campus Map</h5>
                    </div>
                    <div className="aspect-video relative overflow-hidden">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3889.927!2d74.9230!3d12.8698!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba35a4c37bf488f%3A0xa6e78a3e38e6b73b!2sSahyadri%20College%20of%20Engineering%20and%20Management!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                            className="w-full h-full border-0"
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Sahyadri College Map"
                        ></iframe>
                    </div>
                </motion.div>
            </div>
        </motion.aside>
    );
}
