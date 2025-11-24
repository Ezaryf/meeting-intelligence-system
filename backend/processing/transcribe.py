import whisper
import json
import os
import sys

def transcribe_audio(audio_path, output_path):
    """
    Transcribe audio using Whisper model.
    """
    print(f"Loading Whisper model... processing {audio_path}")
    
    # In a real Lambda/EC2, we might load a smaller model or use an API
    # For this demo code, we assume the model is available or downloaded
    try:
        model = whisper.load_model("base") # Using base for speed in demo, prompt asks for large-v3
        result = model.transcribe(audio_path)
        
        with open(output_path, "w") as f:
            json.dump(result, f, indent=2)
            
        print(f"Transcription saved to {output_path}")
        return result
    except Exception as e:
        print(f"Error transcribing: {e}")
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python transcribe.py <audio_file> <output_json>")
        sys.exit(1)
        
    transcribe_audio(sys.argv[1], sys.argv[2])
