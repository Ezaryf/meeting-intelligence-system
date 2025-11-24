import React, { useState } from 'react';
import { Play, Pause } from 'lucide-react';

const MOCK_TRANSCRIPT = [
    { time: 0, speaker: "Alice", text: "Hello everyone, let's get started." },
    { time: 5, speaker: "Bob", text: "Hi Alice, I'm ready." },
    { time: 10, speaker: "Alice", text: "Great. Today we need to discuss the Q3 roadmap." },
    { time: 15, speaker: "Bob", text: "I have the data prepared." },
];

export const VideoPlayer: React.FC = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);

    // Mock progress
    React.useEffect(() => {
        let interval: any;
        if (isPlaying) {
            interval = setInterval(() => {
                setCurrentTime(t => t + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isPlaying]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
            {/* Video Area */}
            <div className="lg:col-span-2 bg-black rounded-xl overflow-hidden relative flex items-center justify-center group">
                <div className="text-white text-center">
                    <p className="text-2xl font-bold mb-2">Meeting Recording</p>
                    <p className="text-slate-400">{Math.floor(currentTime / 60)}:{String(currentTime % 60).padStart(2, '0')}</p>
                </div>

                {/* Controls Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex items-center gap-4 text-white">
                        <button onClick={() => setIsPlaying(!isPlaying)}>
                            {isPlaying ? <Pause /> : <Play />}
                        </button>
                        <div className="flex-1 h-1 bg-slate-600 rounded-full overflow-hidden">
                            <div className="h-full bg-primary w-1/3"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Transcript Area */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col">
                <div className="p-4 border-b border-slate-100">
                    <h3 className="font-semibold">Transcript</h3>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {MOCK_TRANSCRIPT.map((segment, idx) => (
                        <div
                            key={idx}
                            className={`p-3 rounded-lg transition-colors ${currentTime >= segment.time && currentTime < (MOCK_TRANSCRIPT[idx + 1]?.time || 999)
                                ? 'bg-blue-50 border-l-4 border-primary'
                                : 'hover:bg-slate-50'
                                }`}
                        >
                            <div className="flex justify-between items-center mb-1">
                                <span className="font-medium text-sm text-slate-700">{segment.speaker}</span>
                                <span className="text-xs text-slate-400">00:{String(segment.time).padStart(2, '0')}</span>
                            </div>
                            <p className="text-slate-600 text-sm">{segment.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
