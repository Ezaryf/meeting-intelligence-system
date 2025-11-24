import os
import uuid
import boto3
import json
from datetime import datetime
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum
from pydantic import BaseModel
from typing import Optional, List

app = FastAPI(title="Meeting Intelligence API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# AWS Clients
s3_client = boto3.client('s3')
# In a real Lambda environment, these would be set via environment variables
RAW_BUCKET = os.environ.get('RAW_BUCKET', 'meeting-intelligence-raw-files')
DB_HOST = os.environ.get('DB_HOST', 'localhost')
DB_USER = os.environ.get('DB_USER', 'dbadmin')
DB_PASS = os.environ.get('DB_PASS', 'securepassword123')
DB_NAME = os.environ.get('DB_NAME', 'meeting_intelligence')

# Models
class MeetingResponse(BaseModel):
    id: str
    title: str
    created_at: datetime
    status: str

# Routes
@app.get("/")
def read_root():
    return {"message": "Welcome to Multimodal Meeting Intelligence API"}

@app.post("/api/meetings/upload")
async def upload_meeting(
    file: UploadFile = File(...),
    title: str = Form(...)
):
    """
    Upload a meeting video/audio file to S3 and trigger processing.
    """
    try:
        file_extension = os.path.splitext(file.filename)[1]
        file_id = str(uuid.uuid4())
        s3_key = f"{file_id}{file_extension}"
        
        # Upload to S3 (Simulated for now if running locally without creds, but code is real)
        # s3_client.upload_fileobj(file.file, RAW_BUCKET, s3_key)
        
        # Generate a presigned URL or just return success
        # In a real app, we might use presigned URLs for direct upload to avoid Lambda limits
        
        # Insert into DB (Mocked for now)
        meeting_id = file_id
        
        # Trigger Step Function (Mocked)
        
        return {
            "id": meeting_id,
            "title": title,
            "s3_key": s3_key,
            "status": "upload_complete_processing_pending"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/meetings", response_model=List[MeetingResponse])
def list_meetings():
    """
    List all meetings.
    """
    # Mock data
    return [
        {
            "id": "123e4567-e89b-12d3-a456-426614174000",
            "title": "Q3 Roadmap Discussion",
            "created_at": datetime.now(),
            "status": "processed"
        }
    ]

@app.get("/api/meetings/{meeting_id}")
def get_meeting(meeting_id: str):
    """
    Get meeting details.
    """
    return {
        "id": meeting_id,
        "title": "Q3 Roadmap Discussion",
        "duration": 3600,
        "participants": ["Alice", "Bob"],
        "status": "processed"
    }

@app.get("/api/meetings/{meeting_id}/transcript")
def get_transcript(meeting_id: str):
    return {
        "meeting_id": meeting_id,
        "segments": [
            {"speaker": "Alice", "start": 0.0, "end": 5.0, "text": "Hello everyone."},
            {"speaker": "Bob", "start": 5.5, "end": 10.0, "text": "Hi Alice, ready to start?"}
        ]
    }

@app.get("/api/meetings/{meeting_id}/summary")
def get_summary(meeting_id: str):
    return {
        "meeting_id": meeting_id,
        "summary": "The team discussed the Q3 roadmap. Key decisions included prioritizing feature X and delaying feature Y.",
        "key_topics": ["Roadmap", "Feature X", "Feature Y"]
    }

@app.get("/api/meetings/{meeting_id}/action-items")
def get_action_items(meeting_id: str):
    return [
        {"text": "Alice to send the report", "assignee": "Alice", "due_date": "2023-11-01"},
        {"text": "Bob to update the jira ticket", "assignee": "Bob", "due_date": "2023-10-25"}
    ]

@app.get("/api/meetings/{meeting_id}/engagement")
def get_engagement(meeting_id: str):
    return {
        "overall_score": 0.85,
        "timeline": [
            {"timestamp": 0, "score": 0.8},
            {"timestamp": 60, "score": 0.9}
        ]
    }

@app.get("/api/meetings/{meeting_id}/sentiment")
def get_sentiment(meeting_id: str):
    return {
        "overall": "positive",
        "timeline": [
            {"timestamp": 0, "sentiment": 0.5},
            {"timestamp": 60, "sentiment": 0.8}
        ]
    }

@app.get("/api/search")
def search_meetings(query: str):
    """
    Semantic search across meetings.
    """
    # Mock search results
    return {
        "query": query,
        "results": [
            {
                "meeting_id": "123e4567-e89b-12d3-a456-426614174000",
                "segment_text": "We need to focus on the Q3 roadmap.",
                "score": 0.95,
                "timestamp": 120.5
            }
        ]
    }

# Lambda Handler
handler = Mangum(app)
