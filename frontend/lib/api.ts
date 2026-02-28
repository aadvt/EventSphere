// lib/api.ts
// Server-side: use Docker internal hostname (backend:8000) or fallback
// Client-side: always use empty string so browser fetches relative to current origin
const IS_SERVER = typeof window === 'undefined';
const API_URL = IS_SERVER
    ? (process.env.API_URL || 'http://127.0.0.1:8000')
    : '';

export interface Event {
    id: string | number;
    title: string;
    description?: string;
    location: string;
    event_date: string;
    capacity: number;
    creator_name?: string;
    registration_count?: number;
}

export async function getEvents(search?: string) {
    let urlStr = `${API_URL}/api/events/`;
    if (search) urlStr += `?search=${encodeURIComponent(search)}`;
    const res = await fetch(urlStr, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch events');
    return res.json();
}

export async function getEvent(id: string) {
    const res = await fetch(`${API_URL}/api/events/${id}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch event');
    return res.json();
}

export async function registerForEvent(data: { event_id: string | number, name: string, email: string }) {
    const res = await fetch(`${API_URL}/api/registrations/public`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return res;
}

export async function adminLogin(email: string, password: string) {
    const params = new URLSearchParams();
    params.append('username', email); // Using OAuth2PasswordRequestForm standard
    params.append('password', password);

    const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params,
    });
    return res;
}

export async function createEvent(data: Omit<Event, 'id'>, token: string) {
    const res = await fetch(`${API_URL}/api/events/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
    });
    return res;
}

export async function updateEvent(id: string | number, data: Partial<Event>, token: string) {
    const res = await fetch(`${API_URL}/api/events/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
    });
    return res;
}

export async function getRegistrations(eventId: string | number, token: string) {
    const res = await fetch(`${API_URL}/api/admin/events/${eventId}/registrations`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to fetch registrations');
    return res.json();
}

export async function getAdminEvents(token: string) {
    const res = await fetch(`${API_URL}/api/events/`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to fetch admin events');
    return res.json();
}

export async function deleteEvent(id: string | number, token: string) {
    const res = await fetch(`${API_URL}/api/events/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return res;
}
