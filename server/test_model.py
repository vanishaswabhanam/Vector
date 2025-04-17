import torch
import os
import sys

# Add the path where server/model.py is located
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    from model import TowerClassifier, load_model
    
    print("Attempting to load model...")
    model_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'tower_classifier.pth')
    print(f"Model path: {model_path}")
    
    if not os.path.exists(model_path):
        print(f"ERROR: Model file not found at {model_path}")
        sys.exit(1)
        
    print(f"Model file size: {os.path.getsize(model_path) / (1024 * 1024):.2f} MB")
    
    # Try to load the model
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Using device: {device}")
    
    # First, try to load with just torch.load
    try:
        print("Testing if the file can be loaded with torch.load...")
        raw_model = torch.load(model_path, map_location=device)
        print(f"Raw model load successful. Type: {type(raw_model)}")
        
        if isinstance(raw_model, dict):
            print(f"Model is a state_dict with {len(raw_model)} keys")
            for key in raw_model.keys():
                print(f"  - {key}: {raw_model[key].shape}")
        else:
            print("Model is not a state_dict, it's a full model")
    except Exception as e:
        print(f"ERROR loading raw model: {e}")
    
    # Now try to load with our load_model function
    try:
        print("\nNow trying to load with our model architecture...")
        model = load_model(model_path)
        print("Model loaded successfully!")
        
        # Test inference with random data
        print("\nTesting inference with random data...")
        input_tensor = torch.randn(1, 3, 224, 224)
        with torch.no_grad():
            output = model(input_tensor)
            print(f"Output shape: {output.shape}")
            
        print("\nAll tests passed! Model is working correctly.")
        
    except Exception as e:
        print(f"ERROR: {e}")
        import traceback
        traceback.print_exc()
        
except ImportError as e:
    print(f"ERROR: Failed to import model module: {e}")
except Exception as e:
    print(f"ERROR: Unexpected error: {e}")
    import traceback
    traceback.print_exc() 