export default function ImagePlaceholder({ className }: { className?: string }) {
    return (
        <div className={`shrink-0 rounded-2xl border-2 border-dashed border-white/10 bg-white/5 flex items-center justify-center transition-all ${className || 'w-48 h-32'}`}>
            <span className="material-symbols-outlined text-slate-600 text-3xl">image</span>
        </div>
    );
}
