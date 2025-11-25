import { Bell, Search } from 'lucide-react';

interface HeaderProps {
    title: string;
}

export function Header({ title }: HeaderProps) {
    return (
        <header className="flex justify-between items-center mb-8 sticky top-0 z-40 bg-slate-50/80 backdrop-blur-md py-4 -mx-8 px-8 border-b border-slate-200/50">
            <div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                    {title}
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
            </div>

            <div className="flex items-center gap-6">
                <div className="relative hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search meetings..."
                        className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-64 transition-all"
                    />
                </div>

                <button className="p-2.5 text-slate-500 hover:text-primary hover:bg-blue-50 rounded-full relative transition-all duration-200">
                    <Bell size={20} />
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white animate-pulse"></span>
                </button>
            </div>
        </header>
    );
}
