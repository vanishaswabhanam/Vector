# Vector - Tower Classification Application

This application provides tower classification capabilities using a pre-trained PyTorch model. The system can classify tower images into four categories:
- Guyed
- Lattice
- Monopole
- Water Tank

## Prerequisites

Before running the application, ensure you have the following installed:
- Node.js (v14 or higher)
- Python 3.7+
- PyTorch
- Torchvision
- Pillow

## Python Dependencies

Install required Python packages:
```bash
pip install torch torchvision pillow
```

## Project Structure

- `src/` - React frontend application
- `server/` - Backend Express server with Python model integration
- `tower_classifier.pth` - Pre-trained PyTorch model for tower classification
- `training_data copy/` - Training data samples for reference

## Running the Application

### Step 1: Start the Backend Server

```bash
cd server
node server.js
```

The server will run on port 3001.

### Step 2: Start the Frontend

In a separate terminal:

```bash
npm start
```

The React application will run on port 3000.

## Using the Tower Classifier

1. Navigate to the "Media Upload" page from the menu
2. Drag and drop or click to upload an image of a tower
3. The system will automatically process the image
4. View the classification result showing the tower type and confidence score

## Tech Stack

- Frontend: React, TypeScript, Emotion (styled components)
- Backend: Express.js, Node.js
- ML: PyTorch (Python)
- Data Transfer: Axios, FormData, Multer

## Supported Image Formats

The classifier supports the following image formats:
- JPEG/JPG
- PNG
- GIF

## Model Architecture

The tower classifier uses a convolutional neural network (CNN) with:
- 3 convolutional layers
- Max pooling
- Dropout for regularization
- Fully connected layers for classification
