import React from 'react';
import { Upload, CheckCircle } from 'lucide-react';

export const UploadZone: React.FC = () => {
    const [isDragging, setIsDragging] = React.useState(false);
    const [file, setFile] = React.useState<File | null>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
            // Simulate upload
            setTimeout(() => alert("Upload simulated!"), 1000);
        }
    };

    return (
        <div
            className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${isDragging ? 'border-primary bg-blue-50' : 'border-slate-300 hover:border-primary'
                }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <div className="flex flex-col items-center gap-4">
                {file ? (
                    <>
                        <CheckCircle className="w-12 h-12 text-green-500" />
                        <div>
                            <p className="font-semibold text-lg">{file.name}</p>
                            <p className="text-sm text-slate-500">Ready to process</p>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="p-4 bg-blue-100 rounded-full">
                            <Upload className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                            <p className="font-semibold text-lg">Drop your meeting recording here</p>
                            <p className="text-sm text-slate-500">MP4, MOV, or WAV up to 2GB</p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
