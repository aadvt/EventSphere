'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Navbar({ isAdmin = false, isDashboard = false }: { isAdmin?: boolean, isDashboard?: boolean }) {
    const handleLogout = () => {
        localStorage.removeItem('admin_token');
        document.cookie = 'admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
        window.location.href = '/admin';
    };

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="fixed top-0 left-0 right-0 z-50 w-full flex items-center justify-between px-8 py-4 bg-[#0f0f0f] border-b border-white/10 shadow-sm text-white"
        >
            <div className="flex items-center gap-3">
                <Link href="/" className="flex items-center gap-3 group">
                    <motion.div
                        whileHover={{ scale: 1.05, rotate: 5 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-10 h-10 bg-[#135bec] rounded-xl flex items-center justify-center shadow-lg shadow-[#135bec]/30 transition-shadow group-hover:shadow-[#135bec]/50"
                    >
                        <span className="material-symbols-outlined text-white text-2xl">hub</span>
                    </motion.div>
                    <h1 className="text-xl font-bold tracking-tight text-white/90 group-hover:text-white transition-colors">EventSphere</h1>
                </Link>
            </div>
            <div className="flex items-center gap-8">
                {!isDashboard ? (
                    <>
                        <Link href="/" className="text-[15px] font-medium text-white transition-colors hover:text-white/80 flex items-center gap-1">
                            Explore Events <span className="material-symbols-outlined text-[18px]">north_east</span>
                        </Link>
                        <Link href="/admin" className="text-[15px] font-medium text-white transition-colors hover:text-white/80 px-4 py-2 rounded-full hover:bg-white/5">
                            Admin Login
                        </Link>
                    </>
                ) : (
                    <>
                        <span className="text-sm text-slate-400">Logged in as Admin</span>
                        <button onClick={handleLogout} className="text-[15px] font-medium text-white transition-colors cursor-pointer px-4 py-2 rounded-full hover:bg-red-500/10 hover:text-red-400">
                            Logout
                        </button>
                    </>
                )}
            </div>
        </motion.nav>
    );
}
