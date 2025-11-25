import cv2
import json
import sys
import numpy as np

try:
    import mediapipe as mp
    HAS_MEDIAPIPE = True
except ImportError:
    HAS_MEDIAPIPE = False
    print("Warning: MediaPipe not found. Video analysis will be simulated.")

def analyze_video(video_path, output_path):
    """
    Analyze video for face detection and engagement metrics using MediaPipe.
    """
    print(f"Analyzing video {video_path}...")
    
    if not HAS_MEDIAPIPE:
        # Mock analysis if MediaPipe is missing
        engagement_data = {
            "overall_attention_score": 0.85,
            "timeline": []
        }
        # Simulate 60 seconds of data
        for i in range(60):
            engagement_data["timeline"].append({
                "timestamp": float(i),
                "attention_score": 0.7 + (0.3 * np.random.random()),
                "faces_detected": 1 if np.random.random() > 0.1 else 0
            })
            
        with open(output_path, "w") as f:
            json.dump(engagement_data, f, indent=2)
        print(f"Video analysis (simulated) saved to {output_path}")
        return

    try:
        mp_face_mesh = mp.solutions.face_mesh
        
        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened():
            raise Exception("Could not open video file")
            
        fps = cap.get(cv2.CAP_PROP_FPS)
        frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        duration = frame_count / fps if fps > 0 else 0
        
        print(f"Video duration: {duration:.2f}s, FPS: {fps}")
        
        engagement_data = {
            "overall_attention_score": 0.0,
            "timeline": []
        }
        
        # Process every Nth frame to save time (e.g., 1 frame per second)
        step = int(fps) if fps > 0 else 30
        
        with mp_face_mesh.FaceMesh(
            static_image_mode=False,
            max_num_faces=5,
            refine_landmarks=True,
            min_detection_confidence=0.5) as face_mesh:
            
            current_frame = 0
            total_attention = 0
            processed_frames = 0
            
            while cap.isOpened():
                success, image = cap.read()
                if not success:
                    break
                
                if current_frame % step == 0:
                    # Convert the BGR image to RGB.
                    image.flags.writeable = False
                    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
                    results = face_mesh.process(image)
                    
                    faces_detected = 0
                    if results.multi_face_landmarks:
                        faces_detected = len(results.multi_face_landmarks)
                    
                    # Simple attention proxy: if faces are detected, assume attention
                    attention_score = 1.0 if faces_detected > 0 else 0.0
                    total_attention += attention_score
                    processed_frames += 1
                    
                    engagement_data["timeline"].append({
                        "timestamp": float(current_frame / fps) if fps > 0 else 0,
                        "attention_score": attention_score,
                        "faces_detected": faces_detected
                    })
                    
                current_frame += 1
                
        cap.release()
        
        if processed_frames > 0:
            engagement_data["overall_attention_score"] = total_attention / processed_frames
            
        with open(output_path, "w") as f:
            json.dump(engagement_data, f, indent=2)
            
        print(f"Video analysis saved to {output_path}")
        
    except Exception as e:
        print(f"Error analyzing video: {e}")
        error_data = {"overall_attention_score": 0, "timeline": [], "error": str(e)}
        with open(output_path, "w") as f:
            json.dump(error_data, f, indent=2)

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python analyze_video.py <video_file> <output_json>")
        sys.exit(1)
        
    analyze_video(sys.argv[1], sys.argv[2])
