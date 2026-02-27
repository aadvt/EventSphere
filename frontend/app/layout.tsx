import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: 'EventSphere - Sahyadri College',
    description: 'Event discovery platform for Sahyadri College',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="dark">
            <head>
                <link href="https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
                <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
            </head>
            <body className="font-display bg-[#0f0f0f] text-slate-100 min-h-screen">
                {children}
            </body>
        </html>
    );
}
