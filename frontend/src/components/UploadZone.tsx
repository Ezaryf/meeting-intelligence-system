import { useState, useCallback } from 'react';
import { Upload, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export function UploadZone() {
    const [isDragging, setIsDragging] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
    const [progress, setProgress] = useState(0);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleUpload(files[0]);
        }
    }, []);

    const handleUpload = (file: File) => {
        setUploadStatus('uploading');
        // Simulate upload
        let p = 0;
        const interval = setInterval(() => {
            p += 5;
            setProgress(p);
            if (p >= 100) {
                clearInterval(interval);
                setUploadStatus('success');
                setTimeout(() => {
                    setUploadStatus('idle');
                    setProgress(0);
                }, 3000);
            }
        }, 100);
    };

    return (
        <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
                relative overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300 group cursor-pointer
                ${isDragging
                    ? 'border-primary bg-primary/5 scale-[1.01] shadow-xl shadow-primary/10'
                    : 'border-slate-200 hover:border-primary/50 hover:bg-slate-50'
                }
            `}
        >
            <div className="p-12 text-center relative z-10">
                <div className={`
                    w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center transition-all duration-300
                    ${uploadStatus === 'success' ? 'bg-green-100 text-green-600' :
                        uploadStatus === 'error' ? 'bg-red-100 text-red-600' :
                            isDragging ? 'bg-primary text-white scale-110' : 'bg-blue-50 text-blue-600 group-hover:scale-110'}
                `}>
                    {uploadStatus === 'success' ? (
                        <CheckCircle2 size={40} className="animate-bounce" />
                    ) : uploadStatus === 'error' ? (
                        <AlertCircle size={40} />
                    ) : uploadStatus === 'uploading' ? (
                        <Loader2 size={40} className="animate-spin" />
                    ) : (
                        <Upload size={40} />
                    )}
                </div>

                <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-slate-900">
                        {uploadStatus === 'uploading' ? 'Uploading meeting...' :
                            uploadStatus === 'success' ? 'Upload complete!' :
                                'Drop your meeting recording here'}
                    </h3>
                    <p className="text-slate-500 max-w-sm mx-auto">
                        {uploadStatus === 'uploading' ? 'Please wait while we process your file.' :
                            'Support for MP4, MOV, and AVI files. AI processing starts automatically.'}
                    </p>
                </div>

                {uploadStatus === 'idle' && (
                    <button className="mt-8 px-8 py-3 bg-white border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm hover:shadow">
                        Select File
                    </button>
                )}
            </div>

            {/* Progress Bar */}
            {uploadStatus === 'uploading' && (
                <div className="absolute bottom-0 left-0 w-full h-1.5 bg-slate-100">
                    <div
                        className="h-full bg-primary transition-all duration-300 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            )}

            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:16px_16px]" />
        </div>
    );
}
