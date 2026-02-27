import Navbar from '@/components/Navbar';
import RegistrationForm from '@/components/RegistrationForm';
import { getEvent } from '@/lib/api';
import { notFound } from 'next/navigation';

export default async function EventDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    let event;
    try {
        event = await getEvent(id);
    } catch (error) {
        notFound();
    }

    const date = new Date(event.event_date);
    const monthShort = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
    const dayNum = date.getDate();
    const fullDate = date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const creatorName = event.creator_name || 'Sahyadri Tech Club';

    return (
        <>
            <Navbar />

            <main className="max-w-[1440px] mx-auto mt-20">
                {/* Event Header Banner */}
                <div className="w-full h-[320px] bg-gradient-to-br from-[#0a1628] via-[#0d1f2d] to-[#1a0a2e] rounded-b-[3rem] overflow-hidden relative border-b border-x border-white/5 flex items-center justify-center">
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px]"></div>
                        <div className="absolute bottom-0 left-1/3 w-[300px] h-[300px] bg-blue-500/8 rounded-full blur-[80px]"></div>
                    </div>
                    <div className="text-center relative z-10">
                        <span className="text-xs font-bold tracking-[0.3em] uppercase text-purple-300/80 mb-3 block">Campus Event</span>
                        <h1 className="text-4xl md:text-5xl font-black text-white leading-tight max-w-2xl mx-auto px-6">{event.title}</h1>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 px-10 mt-10 mb-20">
                    {/* Left Column: Event Details */}
                    <div className="md:col-span-7 space-y-10">
                        {/* Hosted By */}
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                {creatorName.charAt(0)}
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Hosted by</p>
                                <p className="text-lg font-bold text-white">{creatorName}</p>
                            </div>
                        </div>

                        {/* Date & Location Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            {/* Date Card */}
                            <div className="flex items-center gap-4 bg-[#1a1a1a] border border-white/5 rounded-2xl p-5">
                                <div className="flex flex-col items-center justify-center bg-white/5 border border-white/10 rounded-xl w-14 h-16 flex-shrink-0">
                                    <span className="text-[10px] font-bold text-purple-400 uppercase leading-none">{monthShort}</span>
                                    <span className="text-2xl font-black text-white leading-none">{dayNum}</span>
                                </div>
                                <div>
                                    <p className="text-white font-semibold">{fullDate}</p>
                                    <p className="text-slate-400 text-sm">{timeStr}</p>
                                </div>
                            </div>

                            {/* Location Card */}
                            <div className="flex items-center gap-4 bg-[#1a1a1a] border border-white/5 rounded-2xl p-5">
                                <div className="flex items-center justify-center bg-white/5 border border-white/10 rounded-xl w-14 h-16 flex-shrink-0">
                                    <span className="material-symbols-outlined text-2xl text-purple-400">location_on</span>
                                </div>
                                <div>
                                    <p className="text-white font-semibold">{event.location}</p>
                                    <p className="text-slate-400 text-sm">Sahyadri Campus</p>
                                </div>
                            </div>
                        </div>

                        {/* About Section */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-white uppercase tracking-wide">About This Event</h3>
                            <div className="text-slate-300 text-base leading-relaxed whitespace-pre-wrap bg-[#1a1a1a] border border-white/5 rounded-2xl p-6">
                                {event.description || 'No description provided for this event.'}
                            </div>
                        </div>

                        {/* Event Details Tags */}
                        <div className="flex flex-wrap gap-3">
                            <span className="text-xs font-bold px-4 py-2 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                                <span className="material-symbols-outlined text-sm align-middle mr-1">group</span>
                                {event.capacity} spots available
                            </span>
                            <span className="text-xs font-bold px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                                <span className="material-symbols-outlined text-sm align-middle mr-1">verified</span>
                                Free Entry
                            </span>
                            <span className="text-xs font-bold px-4 py-2 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20">
                                <span className="material-symbols-outlined text-sm align-middle mr-1">school</span>
                                Open to All Students
                            </span>
                        </div>
                    </div>

                    {/* Right Column: Registration */}
                    <div className="md:col-span-5 relative">
                        <div className="sticky top-28">
                            <RegistrationForm eventId={event.id} spotsLeft={event.capacity} />
                        </div>
                    </div>
                </div>
            </main>

            <footer className="px-10 py-10 border-t border-white/10 text-center text-slate-500 text-sm">
                &copy; 2026 Sahyadri College of Engineering &amp; Management. EventSphere Platform.
            </footer>
        </>
    );
}
