import { useState } from 'react';
import { UploadZone } from './components/UploadZone';
import { VideoPlayer } from './components/VideoPlayer';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { LayoutDashboard, Video, Search, Settings, Bell } from 'lucide-react';

function App() {
    const [activeTab, setActiveTab] = useState('dashboard');

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-200 fixed h-full z-10">
                <div className="p-6 border-b border-slate-100">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                        MeetingIntel
                    </h1>
                </div>
                <nav className="p-4 space-y-2">
                    <button
                        onClick={() => setActiveTab('dashboard')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-blue-50 text-primary font-medium' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                        <LayoutDashboard size={20} />
                        Dashboard
                    </button>
                    <button
                        onClick={() => setActiveTab('meetings')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'meetings' ? 'bg-blue-50 text-primary font-medium' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                        <Video size={20} />
                        My Meetings
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
                        <Search size={20} />
                        Search Insights
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
                        <Settings size={20} />
                        Settings
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">
                            {activeTab === 'dashboard' ? 'Dashboard Overview' : 'Q3 Roadmap Discussion'}
                        </h2>
                        <p className="text-slate-500">Welcome back, Alex</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="p-2 text-slate-400 hover:text-slate-600 relative">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                        <div className="w-10 h-10 bg-slate-200 rounded-full overflow-hidden">
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="User" />
                        </div>
                    </div>
                </header>

                {activeTab === 'dashboard' ? (
                    <div className="space-y-8">
                        <section>
                            <h3 className="text-lg font-semibold mb-4">Quick Upload</h3>
                            <UploadZone />
                        </section>

                        <section>
                            <h3 className="text-lg font-semibold mb-4">Recent Analytics</h3>
                            <AnalyticsDashboard />
                        </section>
                    </div>
                ) : (
                    <div className="space-y-8">
                        <VideoPlayer />
                        <AnalyticsDashboard />
                    </div>
                )}
            </main>
        </div>
    );
}

export default App;
