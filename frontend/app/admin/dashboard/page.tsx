'use client';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { getAdminEvents, createEvent, updateEvent, deleteEvent, getRegistrations, type Event } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
    const router = useRouter();
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState('');

    const [isEventModalOpen, setIsEventModalOpen] = useState(false);
    const [isRegistrationsModalOpen, setIsRegistrationsModalOpen] = useState(false);
    const [currentRegistrations, setCurrentRegistrations] = useState<{ user_full_name: string, user_email: string, registered_at: string, registration_id: string }[]>([]);

    const [formData, setFormData] = useState<Partial<Event>>({
        title: '', description: '', location: '', event_date: '', capacity: 0
    });
    const [editingId, setEditingId] = useState<string | number | null>(null);

    useEffect(() => {
        const t = localStorage.getItem('admin_token');
        if (!t) {
            router.push('/admin');
            return;
        }
        setToken(t);
        loadEvents(t);
    }, [router]);

    async function loadEvents(t: string) {
        try {
            const data = await getAdminEvents(t);
            setEvents(data.items || data);
        } catch (e) {
            console.error(e);
            if ((e as Error).message.includes('fetch')) {
                // likely 401 Unauthorized => clear token and redirect
                localStorage.removeItem('admin_token');
                router.push('/admin');
            }
        } finally {
            setLoading(false);
        }
    }

    const handleDelete = async (eventId: string | number) => {
        if (!confirm('Are you sure you want to delete this event?')) return;
        try {
            const res = await deleteEvent(eventId, token);
            if (res.ok) {
                setEvents(events.filter(e => e.id !== eventId));
            }
        } catch (err) {
            alert('Failed to delete event');
        }
    };

    const handleOpenCreate = () => {
        setFormData({ title: '', description: '', location: '', event_date: '', capacity: 0 });
        setEditingId(null);
        setIsEventModalOpen(true);
    };

    const handleOpenEdit = (event: Event) => {
        setFormData({ ...event });
        setEditingId(event.id);
        setIsEventModalOpen(true);
    };

    const handleSaveEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingId) {
                await updateEvent(editingId, formData, token);
            } else {
                await createEvent(formData as Omit<Event, 'id'>, token);
            }
            setIsEventModalOpen(false);
            loadEvents(token);
        } catch (err) {
            alert('Failed to save event');
        }
    };

    const handleViewRegistrations = async (eventId: string | number) => {
        try {
            const data = await getRegistrations(eventId, token);
            setCurrentRegistrations(data);
            setIsRegistrationsModalOpen(true);
        } catch {
            alert('Failed to load registrations');
        }
    };

    return (
        <>
            <Navbar isDashboard={true} />

            <main className="max-w-[1440px] mx-auto px-10 py-16 min-h-screen">
                <div className="flex justify-between items-center mb-12">
                    <h1 className="text-4xl font-bold text-white">Manage Events</h1>
                    <button
                        onClick={handleOpenCreate}
                        className="bg-white text-black font-bold px-6 py-3 rounded-full hover:bg-slate-200 transition-colors"
                    >
                        + Create Event
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-20 text-slate-400">Loading events...</div>
                ) : (
                    <div className="bg-[#1a1a1a] rounded-3xl border border-white/5 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/5 border-b border-white/5 text-xs font-bold uppercase tracking-widest text-slate-400">
                                    <th className="p-6">Event Title</th>
                                    <th className="p-6">Date</th>
                                    <th className="p-6">Location</th>
                                    <th className="p-6">Spots Remaining</th>
                                    <th className="p-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {events.map(ev => {
                                    const dateObj = new Date(ev.event_date);
                                    return (
                                        <tr key={ev.id} className="hover:bg-white/5 transition-colors">
                                            <td className="p-6 font-bold text-white">{ev.title}</td>
                                            <td className="p-6 text-slate-300">
                                                {isNaN(dateObj.getTime()) ? ev.event_date : dateObj.toLocaleDateString()}
                                            </td>
                                            <td className="p-6 text-slate-300">{ev.location}</td>
                                            <td className="p-6">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${ev.capacity > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-500'}`}>
                                                    {ev.capacity}
                                                </span>
                                            </td>
                                            <td className="p-6 text-right space-x-3">
                                                <button onClick={() => handleOpenEdit(ev)} className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors">
                                                    Edit
                                                </button>
                                                <button onClick={() => handleViewRegistrations(ev.id)} className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors">
                                                    View Registrations
                                                </button>
                                                <button onClick={() => handleDelete(ev.id)} className="bg-red-500/10 hover:bg-red-500/20 text-red-400 px-4 py-2 rounded-full text-sm font-semibold transition-colors">
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })}
                                {events.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="p-10 text-center text-slate-500">No events found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>

            {/* Editor Modal */}
            {isEventModalOpen && (
                <div className="fixed inset-0 z-[200] bg-black/80 flex items-center justify-center p-6 backdrop-blur-sm">
                    <div className="bg-[#1a1a1a] rounded-3xl border border-white/10 p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold mb-6">{editingId ? 'Edit Event' : 'Create Event'}</h2>
                        <form onSubmit={handleSaveEvent} className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Title</label>
                                <input required type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full bg-[#0f0f0f] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#135bec]" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Description</label>
                                <textarea required value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full bg-[#0f0f0f] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#135bec] min-h-[100px]" />
                            </div>
                            <div className="grid grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Location</label>
                                    <input required type="text" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} className="w-full bg-[#0f0f0f] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#135bec]" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Capacity</label>
                                    <input required type="number" min="0" value={formData.capacity} onChange={e => setFormData({ ...formData, capacity: parseInt(e.target.value) })} className="w-full bg-[#0f0f0f] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#135bec]" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Date & Time</label>
                                <input required type="datetime-local" value={formData.event_date ? (formData.event_date as string).slice(0, 16) : ''} onChange={e => setFormData({ ...formData, event_date: new Date(e.target.value).toISOString() })} className="w-full bg-[#0f0f0f] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#135bec] [color-scheme:dark]" />
                            </div>
                            <div className="flex justify-end gap-3 mt-8">
                                <button type="button" onClick={() => setIsEventModalOpen(false)} className="px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 font-bold transition-colors">Cancel</button>
                                <button type="submit" className="px-6 py-3 rounded-full bg-white text-black hover:bg-slate-200 font-bold transition-colors">Save Event</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Registrations Modal */}
            {isRegistrationsModalOpen && (
                <div className="fixed inset-0 z-[200] bg-black/80 flex items-center justify-center p-6 backdrop-blur-sm">
                    <div className="bg-[#1a1a1a] rounded-3xl border border-white/10 p-8 w-full max-w-2xl max-h-[90vh] flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">Registrations</h2>
                            <button onClick={() => setIsRegistrationsModalOpen(false)} className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 text-xl font-bold">&times;</button>
                        </div>
                        <div className="overflow-y-auto flex-1 bg-[#0f0f0f] rounded-2xl border border-white/5">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-white/5 border-b border-white/5 text-xs font-bold text-slate-400 uppercase">
                                    <tr>
                                        <th className="p-4">Name</th>
                                        <th className="p-4">Email</th>
                                        <th className="p-4">Registered At</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {currentRegistrations.map((reg, i) => (
                                        <tr key={i} className="hover:bg-white/5">
                                            <td className="p-4 font-semibold">{reg.user_full_name || '-'}</td>
                                            <td className="p-4 text-slate-400">{reg.user_email || '-'}</td>
                                            <td className="p-4 text-slate-400">{new Date(reg.registered_at || Date.now()).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                    {currentRegistrations.length === 0 && (
                                        <tr>
                                            <td colSpan={3} className="p-8 text-center text-slate-500">No registrations yet.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
