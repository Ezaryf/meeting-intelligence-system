import os
import uuid
import json
import sqlite3
import threading
import shutil
from datetime import datetime
from fastapi import FastAPI, HTTPException, UploadFile, File, Form, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import Optional, List

# Import processing functions
# Assuming these are in the python path or we append it
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from processing.transcribe import transcribe_audio
from processing.analyze_video import analyze_video
from processing.summarize import summarize_text
from processing.embeddings import generate_embeddings

app = FastAPI(title="Meeting Intelligence API (Local)")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Local Config
UPLOAD_DIR = "uploads"
PROCESSED_DIR = "processed"
DB_PATH = "meeting_intelligence.db"

os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(PROCESSED_DIR, exist_ok=True)

# Database Setup
def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS meetings (
            id TEXT PRIMARY KEY,
            title TEXT,
            filename TEXT,
            status TEXT,
            created_at TIMESTAMP,
            duration INTEGER
        )
    ''')
    conn.commit()
    conn.close()

init_db()

# Models
class MeetingResponse(BaseModel):
    id: str
    title: str
    created_at: str
    status: str

# Background Processing Task
def process_meeting(meeting_id: str, file_path: str):
    print(f"Starting processing for {meeting_id}")
    
    try:
        # 1. Transcribe (Whisper)
        # Note: Whisper handles video files directly usually, or we extract audio
        transcript_path = os.path.join(PROCESSED_DIR, f"{meeting_id}_transcript.json")
        transcribe_audio(file_path, transcript_path)
        
        # 2. Video Analysis (MediaPipe)
        analysis_path = os.path.join(PROCESSED_DIR, f"{meeting_id}_analysis.json")
        analyze_video(file_path, analysis_path)
        
        # 3. Summarize
        summary_path = os.path.join(PROCESSED_DIR, f"{meeting_id}_summary.json")
        summarize_text(transcript_path, summary_path)
        
        # 4. Embeddings (Optional/Mock for now if too heavy)
        # embeddings_path = os.path.join(PROCESSED_DIR, f"{meeting_id}_embeddings.json")
        # generate_embeddings(transcript_path, embeddings_path)
        
        # Update DB status
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        c.execute("UPDATE meetings SET status = 'processed' WHERE id = ?", (meeting_id,))
        conn.commit()
        conn.close()
        print(f"Processing complete for {meeting_id}")
        
    except Exception as e:
        print(f"Error processing {meeting_id}: {e}")
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        c.execute("UPDATE meetings SET status = 'failed' WHERE id = ?", (meeting_id,))
        conn.commit()
        conn.close()

# Routes
@app.get("/")
def read_root():
    return {"message": "Meeting Intelligence API (Local Mode)"}

@app.post("/api/meetings/upload")
async def upload_meeting(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    title: str = Form(...) # Changed to Form to match frontend
):
    try:
        file_id = str(uuid.uuid4())
        file_extension = os.path.splitext(file.filename)[1]
        filename = f"{file_id}{file_extension}"
        file_path = os.path.join(UPLOAD_DIR, filename)
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # Insert into DB
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        c.execute(
            "INSERT INTO meetings (id, title, filename, status, created_at) VALUES (?, ?, ?, ?, ?)",
            (file_id, title, filename, "processing", datetime.now().isoformat())
        )
        conn.commit()
        conn.close()
        
        # Trigger processing in background
        background_tasks.add_task(process_meeting, file_id, file_path)
        
        return {
            "id": file_id,
            "title": title,
            "status": "processing"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/meetings")
def list_meetings():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    c.execute("SELECT * FROM meetings ORDER BY created_at DESC")
    rows = c.fetchall()
    conn.close()
    
    return [dict(row) for row in rows]

@app.get("/api/meetings/{meeting_id}")
def get_meeting(meeting_id: str):
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    c.execute("SELECT * FROM meetings WHERE id = ?", (meeting_id,))
    row = c.fetchone()
    conn.close()
    
    if not row:
        raise HTTPException(status_code=404, detail="Meeting not found")
        
    return dict(row)

@app.get("/api/meetings/{meeting_id}/transcript")
def get_transcript(meeting_id: str):
    path = os.path.join(PROCESSED_DIR, f"{meeting_id}_transcript.json")
    if not os.path.exists(path):
        # Return mock if processing not done or failed, or 404
        return {"segments": []}
    with open(path, "r") as f:
        return json.load(f)

@app.get("/api/meetings/{meeting_id}/engagement")
def get_engagement(meeting_id: str):
    path = os.path.join(PROCESSED_DIR, f"{meeting_id}_analysis.json")
    if not os.path.exists(path):
        return {"timeline": []}
    with open(path, "r") as f:
        return json.load(f)

@app.get("/api/meetings/{meeting_id}/summary")
def get_summary(meeting_id: str):
    path = os.path.join(PROCESSED_DIR, f"{meeting_id}_summary.json")
    if not os.path.exists(path):
        return {"summary": "Processing...", "key_topics": []}
    with open(path, "r") as f:
        return json.load(f)

# Serve uploaded files statically for video player
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
