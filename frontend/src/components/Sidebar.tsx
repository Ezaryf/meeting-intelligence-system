import { LayoutDashboard, Video, Search, Settings, LogOut } from 'lucide-react';

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
    const menuItems = [
        { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { id: 'meetings', icon: Video, label: 'My Meetings' },
        { id: 'search', icon: Search, label: 'Search Insights' },
        { id: 'settings', icon: Settings, label: 'Settings' },
    ];

    return (
        <aside className="w-72 bg-slate-900 text-white flex flex-col h-screen fixed left-0 top-0 z-50 transition-all duration-300 shadow-2xl">
            <div className="p-8">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    MeetingIntel
                </h1>
                <p className="text-slate-400 text-xs mt-1 tracking-wider uppercase">AI-Powered Insights</p>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group relative overflow-hidden ${activeTab === item.id
                                ? 'bg-primary text-white shadow-lg shadow-primary/25'
                                : 'text-slate-400 hover:bg-white/5 hover:text-white'
                            }`}
                    >
                        <item.icon
                            size={20}
                            className={`transition-transform duration-200 ${activeTab === item.id ? 'scale-110' : 'group-hover:scale-110'
                                }`}
                        />
                        <span className="font-medium">{item.label}</span>
                        {activeTab === item.id && (
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white/20 rounded-l-full" />
                        )}
                    </button>
                ))}
            </nav>

            <div className="p-4 mt-auto">
                <div className="bg-white/5 rounded-xl p-4 backdrop-blur-sm border border-white/10">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 p-[2px]">
                            <img
                                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
                                alt="User"
                                className="w-full h-full rounded-full bg-slate-900"
                            />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-white">Alex Morgan</p>
                            <p className="text-xs text-slate-400">Pro Plan</p>
                        </div>
                    </div>
                    <button className="w-full flex items-center justify-center gap-2 text-xs text-slate-400 hover:text-white transition-colors py-2 hover:bg-white/5 rounded-lg">
                        <LogOut size={14} />
                        Sign Out
                    </button>
                </div>
            </div>
        </aside>
    );
}
