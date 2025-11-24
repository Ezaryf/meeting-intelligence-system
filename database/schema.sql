-- Main meetings table
CREATE TABLE meetings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(500) NOT NULL,
    video_s3_url VARCHAR(1000),
    audio_s3_url VARCHAR(1000),
    duration_seconds INTEGER,
    participant_count INTEGER,
    recording_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    processed_at TIMESTAMP,
    processing_status VARCHAR(50) DEFAULT 'pending',
    metadata JSONB
);

-- Speaker-diarized transcripts
CREATE TABLE transcripts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meeting_id UUID REFERENCES meetings(id),
    speaker_label VARCHAR(100),
    speaker_name VARCHAR(200),
    text TEXT NOT NULL,
    start_time DECIMAL(10,3),
    end_time DECIMAL(10,3),
    confidence_score DECIMAL(5,4),
    sentiment_label VARCHAR(20),
    sentiment_score DECIMAL(5,4),
    embeddings_vector VECTOR(384), -- SentenceTransformer dimensions
    created_at TIMESTAMP DEFAULT NOW()
);

-- Video engagement analytics
CREATE TABLE engagement_frames (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meeting_id UUID REFERENCES meetings(id),
    frame_timestamp DECIMAL(10,3),
    frame_s3_url VARCHAR(1000),
    faces_detected INTEGER,
    engagement_metrics JSONB, -- {eye_scores: [], head_poses: [], attention_scores: []}
    overall_attention_score DECIMAL(5,4),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Action items extraction
CREATE TABLE action_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meeting_id UUID REFERENCES meetings(id),
    text TEXT NOT NULL,
    assigned_to VARCHAR(200), -- Extracted person name
    due_date DATE,
    priority VARCHAR(20),
    status VARCHAR(50) DEFAULT 'pending',
    confidence_score DECIMAL(5,4),
    context_segment_id UUID REFERENCES transcripts(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Meeting summaries
CREATE TABLE meeting_summaries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meeting_id UUID REFERENCES meetings(id),
    summary_type VARCHAR(50), -- 'executive', 'detailed', 'bullet_points'
    summary_text TEXT NOT NULL,
    key_topics JSONB, -- Array of key discussion topics
    decisions_made JSONB, -- Array of decisions
    participants_list JSONB, -- Array of participants
    created_at TIMESTAMP DEFAULT NOW()
);

-- Search index for multimodal content
CREATE TABLE search_moments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meeting_id UUID REFERENCES meetings(id),
    transcript_id UUID REFERENCES transcripts(id),
    moment_type VARCHAR(50), -- 'action_item', 'decision', 'question', 'insight'
    text_description TEXT,
    start_time DECIMAL(10,3),
    end_time DECIMAL(10,3),
    text_embedding VECTOR(384),
    visual_embedding VECTOR(512), -- CLIP dimensions
    confidence_score DECIMAL(5,4),
    created_at TIMESTAMP DEFAULT NOW()
);
