import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { UploadZone } from './components/UploadZone';
import { VideoPlayer } from './components/VideoPlayer';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';

function App() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [meetings, setMeetings] = useState<any[]>([]);

    useEffect(() => {
        if (activeTab === 'meetings') {
            fetch('http://localhost:8000/api/meetings')
                .then(res => res.json())
                .then(data => setMeetings(data))
                .catch(err => console.error(err));
        }
    }, [activeTab]);

    const getTitle = () => {
        switch (activeTab) {
            case 'dashboard': return 'Dashboard Overview';
            case 'meetings': return 'My Meetings';
            case 'search': return 'Search Insights';
            case 'settings': return 'Settings';
            default: return 'Dashboard';
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Main Content */}
            <main className="flex-1 ml-72 p-8 min-h-screen transition-all duration-300">
                <div className="max-w-7xl mx-auto">
                    <Header title={getTitle()} />

                    <div className="animate-fade-in">
                        {activeTab === 'dashboard' ? (
                            <div className="space-y-8">
                                <section>
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-lg font-semibold text-slate-800">Quick Upload</h3>
                                    </div>
                                    <UploadZone />
                                </section>

                                <section>
                                    <h3 className="text-lg font-semibold text-slate-800 mb-6">Recent Analytics</h3>
                                    <AnalyticsDashboard />
                                </section>
                            </div>
                        ) : activeTab === 'meetings' ? (
                            <div className="space-y-4">
                                {meetings.length === 0 ? (
                                    <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 border-dashed">
                                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <span className="text-2xl">📹</span>
                                        </div>
                                        <h3 className="text-lg font-medium text-slate-900">No meetings found</h3>
                                        <p className="text-slate-500 mt-1">Upload your first meeting to get started.</p>
                                    </div>
                                ) : (
                                    <div className="grid gap-4">
                                        {meetings.map(m => (
                                            <div key={m.id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all flex justify-between items-center group">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg">
                                                        {m.title.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-slate-900 group-hover:text-primary transition-colors">{m.title}</h4>
                                                        <p className="text-sm text-slate-500">{new Date(m.created_at).toLocaleString()}</p>
                                                    </div>
                                                </div>
                                                <span className={`px-3 py-1.5 rounded-full text-xs font-medium border ${m.status === 'processed' ? 'bg-green-50 text-green-700 border-green-200' :
                                                        m.status === 'processing' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                            'bg-slate-50 text-slate-700 border-slate-200'
                                                    }`}>
                                                    {m.status.charAt(0).toUpperCase() + m.status.slice(1)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-8">
                                <VideoPlayer />
                                <AnalyticsDashboard />
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default App;

