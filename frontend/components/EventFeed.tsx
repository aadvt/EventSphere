'use client';
import { useEffect, useState } from 'react';
import EventCard from './EventCard';
import { getEvents, type Event } from '../lib/api';

function getDateLabel(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const isToday = date.toDateString() === now.toDateString();
    const isTomorrow = date.toDateString() === tomorrow.toDateString();

    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    const monthDay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    if (isToday) return `Today  ${dayName}`;
    if (isTomorrow) return `Tomorrow  ${dayName}`;
    return `${monthDay}  ${dayName}`;
}

function groupEventsByDate(events: Event[]): { label: string; events: Event[] }[] {
    const groups: { label: string; events: Event[] }[] = [];
    let currentLabel = '';

    for (const event of events) {
        const label = getDateLabel(event.event_date);
        if (label !== currentLabel) {
            currentLabel = label;
            groups.push({ label, events: [event] });
        } else {
            groups[groups.length - 1].events.push(event);
        }
    }
    return groups;
}

export default function EventFeed() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        async function load() {
            try {
                const data = await getEvents();
                setEvents(data.items || data);
            } catch (err) {
                setError(true);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    if (error) {
        return <p className="text-red-400">Failed to load events. Please refresh.</p>;
    }

    if (loading) {
        return (
            <div className="space-y-8">
                <div className="h-8 w-48 skeleton rounded-lg"></div>
                <div className="grid gap-6">
                    {[1, 2].map(i => (
                        <div key={i} className="bg-[#1a1a1a] border border-white/5 rounded-3xl p-6 flex gap-6">
                            <div className="flex-1 space-y-4">
                                <div className="h-6 w-32 skeleton rounded-full"></div>
                                <div className="h-10 w-full skeleton rounded-lg"></div>
                                <div className="h-8 w-40 skeleton rounded-full"></div>
                            </div>
                            <div className="w-48 h-32 skeleton rounded-2xl"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (events.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                <span className="material-symbols-outlined text-6xl text-slate-700">calendar_today</span>
                <h3 className="text-xl font-bold text-white">No upcoming events</h3>
                <p className="text-slate-400">Check back later for new updates from Sahyadri College.</p>
            </div>
        );
    }

    const grouped = groupEventsByDate(events);

    return (
        <div className="space-y-8">
            <h3 className="text-2xl font-bold flex items-center gap-3 mb-2">
                Upcoming Events <span className="h-[1px] flex-1 bg-white/10"></span>
            </h3>
            {grouped.map((group, gi) => (
                <div key={gi} className="space-y-5">
                    <div className="flex items-center gap-3 sticky top-[72px] z-20 py-2 bg-[#0f0f0f]/90 backdrop-blur-md">
                        <div className="w-2.5 h-2.5 rounded-full bg-white/60"></div>
                        <span className="text-[15px] font-bold text-white/90">{group.label.split('  ')[0]}</span>
                        <span className="text-[15px] font-medium text-white/40">{group.label.split('  ')[1]}</span>
                    </div>
                    <div className="grid gap-5 pl-5 border-l border-white/5">
                        {group.events.map(ev => (
                            <EventCard key={ev.id} event={ev} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
