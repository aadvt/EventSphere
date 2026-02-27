// Generates a deterministic gradient + icon visual for events based on the title
const GRADIENTS = [
    'from-purple-600 to-blue-500',
    'from-orange-500 to-pink-500',
    'from-emerald-500 to-cyan-500',
    'from-rose-500 to-violet-500',
    'from-amber-500 to-red-500',
    'from-sky-500 to-indigo-500',
    'from-lime-500 to-green-600',
    'from-fuchsia-500 to-purple-600',
];

const ICONS = [
    'school', 'code', 'science', 'rocket_launch', 'groups',
    'emoji_objects', 'terminal', 'hub', 'psychology', 'cloud',
    'memory', 'developer_board', 'bolt', 'extension', 'build',
];

function hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash);
}

export default function EventVisual({ title, className }: { title: string, className?: string }) {
    const hash = hashString(title || 'event');
    const gradient = GRADIENTS[hash % GRADIENTS.length];
    const icon = ICONS[hash % ICONS.length];

    return (
        <div className={`shrink-0 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center overflow-hidden relative ${className || 'w-48 h-32'}`}>
            <span className="material-symbols-outlined text-white/30 text-6xl absolute">{icon}</span>
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
        </div>
    );
}
