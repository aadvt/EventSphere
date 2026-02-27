import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import EventFeed from '@/components/EventFeed';
import Sidebar from '@/components/Sidebar';

export default function Home() {
    return (
        <>
            <Navbar />
            <HeroSection />

            <main className="max-w-[1440px] mx-auto px-10 py-20 grid grid-cols-1 md:grid-cols-12 gap-12">
                <div className="md:col-span-8 space-y-12">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 bg-[#1a1a1a] border border-white/10 px-4 py-2 rounded-full w-full max-w-md">
                            <span className="material-symbols-outlined text-slate-400">search</span>
                            <input
                                className="bg-transparent border-none outline-none focus:ring-0 text-white placeholder-slate-500 text-sm w-full"
                                placeholder="Search for events..."
                                type="text"
                            />
                        </div>
                    </div>

                    <EventFeed />
                </div>

                <Sidebar />
            </main>

            <footer className="max-w-[1440px] mx-auto px-10 py-20 border-t border-white/5 flex justify-between items-center text-slate-500">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-2xl">hub</span>
                    <span className="font-bold text-white/50">EventSphere</span>
                </div>
                <div className="flex gap-8 text-xs font-medium uppercase tracking-widest">
                    <a className="hover:text-white transition-colors" href="#">Privacy</a>
                    <a className="hover:text-white transition-colors" href="#">Guidelines</a>
                    <a className="hover:text-white transition-colors" href="#">Contact Support</a>
                </div>
            </footer>
        </>
    );
}
