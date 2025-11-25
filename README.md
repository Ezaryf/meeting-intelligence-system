# Multimodal Meeting Intelligence System

An enterprise-grade platform that analyzes meeting recordings to generate transcripts, summaries, action items, engagement metrics, and searchable insights using advanced AI models and AWS cloud architecture.

## 🚀 Features

- **Multimodal Analysis**: Processes Audio, Video, and Text.
- **AI-Powered Insights**:
  - Speech-to-Text with **Whisper**.
  - Speaker Diarization with **PyAnnotate**.
  - Video Engagement Analytics with **MediaPipe**.
  - Semantic Search with **Embeddings**.
- **Interactive Dashboard**: React-based UI with synchronized video/transcript playback.
- **Scalable Infrastructure**: Built on AWS (Lambda, S3, RDS, Step Functions).

## 🏗️ Architecture

### AWS Cloud Infrastructure
- **Compute**: AWS Lambda (Serverless processing), Step Functions (Orchestration).
- **Storage**: S3 (Raw videos, processed data), RDS PostgreSQL (Metadata, structured results).
- **Networking**: VPC with public/private subnets.

### Tech Stack
- **Frontend**: React, TypeScript, Tailwind CSS, Recharts, Lucide.
- **Backend**: Python, FastAPI, Mangum (AWS Adapter).
- **ML Pipeline**: OpenAI Whisper, PyAnnotate, MediaPipe, Transformers.
- **IaC**: Terraform.

## 🛠️ Setup & Deployment

### Prerequisites
- AWS CLI configured.
- Terraform installed.
- Node.js (v16+) & npm.
- Python 3.9+.

### 1. Infrastructure (Terraform)
Deploy the AWS resources:
```bash
cd infrastructure
terraform init
terraform apply
```

### 2. Database
Initialize the PostgreSQL schema:
```bash
# Connect to your RDS instance
psql -h <RDS_ENDPOINT> -U dbadmin -d meeting_intelligence -f database/schema.sql
```

### 3. Backend
The backend is designed to run on AWS Lambda but can be tested locally:
```bash
cd backend
pip install -r requirements.txt
# Run API locally (patched for your environment)
python run.py
```

### 4. Frontend
Setup the dashboard:
```bash
cd frontend
npm install
npm run dev
```

## 📖 Usage

1. **Upload**: Drag & drop meeting recordings (MP4/MOV) in the dashboard.
2. **Processing**: The system automatically triggers the AI pipeline (Transcribe -> Diarize -> Analyze).
3. **Analyze**:
   - View speaker-labeled transcripts.
   - Check engagement and sentiment charts.
   - Review extracted action items.
4. **Search**: Use natural language to find specific moments across meetings.

## 📄 License
MIT
