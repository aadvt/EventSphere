import Link from 'next/link';
import { motion } from 'framer-motion';
import EventVisual from './EventVisual';
import type { Event } from '../lib/api';

export default function EventCard({ event }: { event: Event }) {
    const date = new Date(event.event_date);
    const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <Link href={`/events/${event.id}`}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="group bg-[#1a1a1a] border border-white/5 hover:border-white/20 hover:shadow-2xl hover:shadow-white/5 rounded-3xl p-6 flex gap-6 cursor-pointer"
            >
                <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-black bg-white px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                            {timeStr}
                        </span>
                        <div className="flex items-center gap-1 text-slate-400 text-sm">
                            <span className="material-symbols-outlined text-sm">location_on</span>
                            <span>{event.location}</span>
                        </div>
                    </div>
                    <h4 className="text-2xl font-bold leading-tight group-hover:text-white transition-colors duration-300">
                        {event.title}
                    </h4>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex -space-x-3">
                                <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-[#1a1a1a] flex items-center justify-center text-[10px] text-white overflow-hidden z-10">
                                    <span className="material-symbols-outlined text-xs">person</span>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-slate-700 border-2 border-[#1a1a1a] flex items-center justify-center text-[10px] text-white overflow-hidden z-0">
                                    <span className="material-symbols-outlined text-xs">person</span>
                                </div>
                            </div>
                            {event.capacity > 0 ? (
                                <span className="text-xs font-bold px-3 py-1 rounded-full uppercase text-emerald-400 bg-emerald-400/10">
                                    {event.capacity} Spots left
                                </span>
                            ) : (
                                <span className="text-xs font-bold px-3 py-1 rounded-full uppercase text-amber-400 bg-amber-400/10">
                                    Waitlist Only
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                <EventVisual title={event.title} className="group-hover:scale-105 w-48 h-32 transition-transform duration-300" />
            </motion.div>
        </Link>
    );
}
