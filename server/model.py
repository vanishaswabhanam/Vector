import torch
import torch.nn as nn
import torchvision.transforms as transforms
from PIL import Image, ImageFilter, ImageEnhance
import io
import sys
import os
import json
import traceback
import numpy as np
from collections import Counter

# Define the model architecture that matches the saved model
class TowerClassifier(nn.Module):
    def __init__(self, num_classes=4):
        super(TowerClassifier, self).__init__()
        # Convolutional layers
        self.conv1 = nn.Conv2d(3, 32, kernel_size=3, stride=1, padding=1)
        self.relu1 = nn.ReLU()
        self.pool1 = nn.MaxPool2d(kernel_size=2, stride=2)
        
        self.conv2 = nn.Conv2d(32, 64, kernel_size=3, stride=1, padding=1)
        self.relu2 = nn.ReLU()
        self.pool2 = nn.MaxPool2d(kernel_size=2, stride=2)
        
        self.conv3 = nn.Conv2d(64, 128, kernel_size=3, stride=1, padding=1)
        self.relu3 = nn.ReLU()
        self.pool3 = nn.MaxPool2d(kernel_size=2, stride=2)
        
        # Adaptive pooling to handle different input sizes
        self.adaptive_pool = nn.AdaptiveAvgPool2d((28, 28))
        
        # Fully connected layers
        self.fc1 = nn.Linear(128 * 28 * 28, 512)
        self.relu4 = nn.ReLU()
        self.dropout = nn.Dropout(0.5)
        
        self.fc2 = nn.Linear(512, 128)
        self.relu5 = nn.ReLU()
        
        self.fc3 = nn.Linear(128, num_classes)
    
    def forward(self, x):
        # Convolutional layers
        x = self.pool1(self.relu1(self.conv1(x)))
        x = self.pool2(self.relu2(self.conv2(x)))
        x = self.pool3(self.relu3(self.conv3(x)))
        
        # Adaptive pooling
        x = self.adaptive_pool(x)
        
        # Flatten
        x = torch.flatten(x, 1)
        
        # Fully connected layers
        x = self.relu4(self.fc1(x))
        x = self.dropout(x)
        x = self.relu5(self.fc2(x))
        x = self.fc3(x)
        
        return x

# Load the model
def load_model(model_path):
    try:
        device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        print(f"Using device: {device}", file=sys.stderr)
        
        model = TowerClassifier(num_classes=4)
        print(f"Model created", file=sys.stderr)
        
        # Check if model file exists
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model file not found: {model_path}")
        
        print(f"Loading model from {model_path}", file=sys.stderr)
        model.load_state_dict(torch.load(model_path, map_location=device))
        model.to(device)
        model.eval()
        print(f"Model loaded successfully", file=sys.stderr)
        return model
    except Exception as e:
        print(f"Error loading model: {str(e)}", file=sys.stderr)
        print(traceback.format_exc(), file=sys.stderr)
        raise

# Enhanced preprocessing with multiple variations
def create_image_variations(image):
    variations = []
    
    # Original image
    variations.append(image)
    
    # Enhance contrast
    enhancer = ImageEnhance.Contrast(image)
    variations.append(enhancer.enhance(1.5))
    
    # Enhance sharpness
    enhancer = ImageEnhance.Sharpness(image)
    variations.append(enhancer.enhance(1.5))
    
    # Apply edge enhancement
    variations.append(image.filter(ImageFilter.EDGE_ENHANCE))
    
    # Rotate slightly (helpful for towers)
    variations.append(image.rotate(5, resample=Image.BILINEAR, expand=False))
    variations.append(image.rotate(-5, resample=Image.BILINEAR, expand=False))
    
    return variations

# Preprocess the image
def preprocess_image(image_bytes):
    try:
        base_transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
        ])
        
        # Open image
        image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        print(f"Image opened: {image.size}", file=sys.stderr)
        
        # Create variations
        variations = create_image_variations(image)
        
        # Transform all variations
        tensor_variations = []
        for img in variations:
            tensor_variations.append(base_transform(img).unsqueeze(0))
        
        return tensor_variations
    except Exception as e:
        print(f"Error preprocessing image: {str(e)}", file=sys.stderr)
        print(traceback.format_exc(), file=sys.stderr)
        raise

# Classify the image using ensemble of variations
def classify_image(model, image_tensors):
    try:
        device = next(model.parameters()).device
        
        # Store predictions from all variations
        all_predictions = []
        class_probabilities = np.zeros(4)
        
        with torch.no_grad():
            for tensor in image_tensors:
                tensor = tensor.to(device)
                outputs = model(tensor)
                probabilities = torch.nn.functional.softmax(outputs, dim=1)
                
                # Get predicted class
                _, predicted = torch.max(probabilities, 1)
                all_predictions.append(predicted.item())
                
                # Accumulate probabilities for weighted voting
                class_probabilities += probabilities.cpu().numpy()[0]
        
        # Find most common prediction with majority voting
        prediction_counts = Counter(all_predictions)
        most_common_class = prediction_counts.most_common(1)[0][0]
        
        # Normalize accumulated probabilities
        class_probabilities /= len(image_tensors)
        
        # Extra check for guyed towers (they seem to be overclassified)
        # If the model says it's guyed but the certainty is low, go with the second-best prediction
        if most_common_class == 0 and class_probabilities[0] < 0.6:  # 0 = guyed
            # Check if another class is close enough
            second_best_class = np.argsort(class_probabilities)[-2]
            if class_probabilities[second_best_class] > 0.3:
                most_common_class = second_best_class
                
        return most_common_class
    except Exception as e:
        print(f"Error classifying image: {str(e)}", file=sys.stderr)
        print(traceback.format_exc(), file=sys.stderr)
        raise

# Map class index to tower type
def get_tower_type(class_index):
    tower_types = ['guyed', 'lattice', 'monopole', 'water_tank']
    return tower_types[class_index]

# Main function that processes the image and returns the classification
def process_image(image_path, model_path):
    try:
        print(f"Starting image processing with model path: {model_path}", file=sys.stderr)
        print(f"Image path: {image_path}", file=sys.stderr)
        
        # Check if image file exists
        if not os.path.exists(image_path):
            raise FileNotFoundError(f"Image file not found: {image_path}")
        
        model = load_model(model_path)
        
        # Read the image file
        with open(image_path, 'rb') as f:
            image_bytes = f.read()
        
        print(f"Image read: {len(image_bytes)} bytes", file=sys.stderr)
        
        # Preprocess image with variations
        image_tensors = preprocess_image(image_bytes)
        print(f"Created {len(image_tensors)} image variations for ensemble", file=sys.stderr)
        
        # Classify with ensemble
        class_index = classify_image(model, image_tensors)
        tower_type = get_tower_type(class_index)
        
        print(f"Classification result: {tower_type}", file=sys.stderr)
        
        result = {
            "success": True,
            "tower_type": tower_type
        }
        
        # IMPORTANT: Print only the JSON to stdout, nothing else
        print(json.dumps(result), flush=True)
        return result
        
    except Exception as e:
        error_result = {
            "success": False,
            "error": str(e)
        }
        print(f"Error occurred: {str(e)}", file=sys.stderr)
        print(traceback.format_exc(), file=sys.stderr)
        
        # IMPORTANT: Print only the JSON to stdout, nothing else
        print(json.dumps(error_result), flush=True)
        return error_result

# When the script is called directly
if __name__ == "__main__":
    try:
        if len(sys.argv) != 3:
            error_msg = {"success": False, "error": "Usage: python model.py <image_path> <model_path>"}
            print(json.dumps(error_msg), flush=True)
            sys.exit(1)
        
        image_path = sys.argv[1]
        model_path = sys.argv[2]
        process_image(image_path, model_path)
    except Exception as e:
        error_msg = {"success": False, "error": f"Unhandled exception: {str(e)}"}
        print(json.dumps(error_msg), flush=True)
        print(f"Unhandled exception: {str(e)}", file=sys.stderr)
        print(traceback.format_exc(), file=sys.stderr)
        sys.exit(1) 