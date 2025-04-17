import torch
import sys
import os
import json
from PIL import Image
import io
import traceback
import numpy as np

# Set up paths
def get_model_path():
    yolo_weights = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 
                               'UTD-Models-Videos/runs/detect/train4/weights/best.pt')
    return yolo_weights

def detect_antennas(image_bytes):
    try:
        # Load the YOLO model
        model_path = get_model_path()
        
        if not os.path.exists(model_path):
            print(f"YOLO model not found at: {model_path}", file=sys.stderr)
            return {"success": False, "error": f"YOLO model not found at: {model_path}"}
        
        print(f"Loading YOLO model from: {model_path}", file=sys.stderr)
        
        try:
            # Try loading model using ultralytics
            model = torch.hub.load('ultralytics/yolov5', 'custom', path=model_path, force_reload=True)
        except Exception as model_err:
            # Handle model loading error
            print(f"Error loading YOLO model: {str(model_err)}", file=sys.stderr)
            print(traceback.format_exc(), file=sys.stderr)
            return {"success": False, "error": f"Error loading YOLO model: {str(model_err)}"}
        
        # Set confidence threshold
        model.conf = 0.25  # confidence threshold
        
        # Open the image from bytes
        image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        
        # Run detection
        results = model(image)
        
        # Get the detection results
        detections = results.pandas().xyxy[0].to_dict(orient='records')
        
        print(f"Found {len(detections)} objects", file=sys.stderr)
        
        # Format results for frontend
        formatted_results = []
        for detection in detections:
            formatted_results.append({
                "class": detection['name'],
                "confidence": float(detection['confidence']),
                "bbox": [
                    float(detection['xmin']),
                    float(detection['ymin']),
                    float(detection['xmax']),
                    float(detection['ymax'])
                ]
            })
        
        # Format and return the JSON result
        result = {
            "success": True,
            "detections": formatted_results,
            "image_size": {
                "width": image.width,
                "height": image.height
            }
        }
        
        return result
        
    except Exception as e:
        print(f"Error in antenna detection: {str(e)}", file=sys.stderr)
        print(traceback.format_exc(), file=sys.stderr)
        return {
            "success": False,
            "error": str(e)
        }

if __name__ == "__main__":
    try:
        if len(sys.argv) != 2:
            error_msg = {"success": False, "error": "Usage: python antenna_detector.py <image_path>"}
            print(json.dumps(error_msg), flush=True)
            sys.exit(1)
        
        image_path = sys.argv[1]
        
        # Check if image file exists
        if not os.path.exists(image_path):
            raise FileNotFoundError(f"Image file not found: {image_path}")
        
        # Read the image file
        with open(image_path, 'rb') as f:
            image_bytes = f.read()
        
        # Process the image
        result = detect_antennas(image_bytes)
        
        # Output the result as JSON
        print(json.dumps(result), flush=True)
        
    except Exception as e:
        error_msg = {"success": False, "error": f"Unhandled exception: {str(e)}"}
        print(json.dumps(error_msg), flush=True)
        print(f"Unhandled exception: {str(e)}", file=sys.stderr)
        print(traceback.format_exc(), file=sys.stderr)
        sys.exit(1) 