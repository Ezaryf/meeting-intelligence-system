import whisper
import json
import os
import sys
import torch

def transcribe_audio(audio_path, output_path):
    """
    Transcribe audio using Whisper model.
    """
    print(f"Loading Whisper model... processing {audio_path}")
    
    try:
        # Check if CUDA is available, otherwise use CPU
        device = "cuda" if torch.cuda.is_available() else "cpu"
        print(f"Using device: {device}")
        
        # Load model (tiny or base for speed in local test)
        model = whisper.load_model("base", device=device)
        
        # Transcribe
        result = model.transcribe(audio_path)
        
        # Save result
        with open(output_path, "w") as f:
            json.dump(result, f, indent=2)
            
        print(f"Transcription saved to {output_path}")
        return result
        
    except Exception as e:
        print(f"Error transcribing: {e}")
        # Create a dummy error result so pipeline continues
        error_result = {"text": "Error during transcription.", "segments": []}
        with open(output_path, "w") as f:
            json.dump(error_result, f, indent=2)
        # We don't exit(1) so the pipeline can try other steps
        return error_result

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python transcribe.py <audio_file> <output_json>")
        sys.exit(1)
        
    transcribe_audio(sys.argv[1], sys.argv[2])
