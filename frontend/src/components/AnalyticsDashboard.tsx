import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const ENGAGEMENT_DATA = [
    { time: '00:00', score: 65 },
    { time: '00:10', score: 75 },
    { time: '00:20', score: 85 },
    { time: '00:30', score: 60 },
    { time: '00:40', score: 90 },
    { time: '00:50', score: 80 },
];

const SENTIMENT_DATA = [
    { time: '00:00', positive: 40, negative: 10 },
    { time: '00:10', positive: 60, negative: 5 },
    { time: '00:20', positive: 70, negative: 15 },
    { time: '00:30', positive: 30, negative: 40 },
    { time: '00:40', positive: 80, negative: 5 },
];

export const AnalyticsDashboard: React.FC = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="font-semibold mb-6">Engagement Timeline</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={ENGAGEMENT_DATA}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="time" axisLine={false} tickLine={false} />
                            <YAxis axisLine={false} tickLine={false} />
                            <Tooltip />
                            <Line type="monotone" dataKey="score" stroke="#2563eb" strokeWidth={2} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="font-semibold mb-6">Sentiment Analysis</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={SENTIMENT_DATA}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="time" axisLine={false} tickLine={false} />
                            <YAxis axisLine={false} tickLine={false} />
                            <Tooltip />
                            <Bar dataKey="positive" fill="#10b981" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="negative" fill="#ef4444" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};
