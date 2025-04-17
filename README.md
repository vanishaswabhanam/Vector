# Vector Cell Tower Classifier

This repository contains a web application for classifying cell tower types and detecting antennas using deep learning models.

## Setup Instructions

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   cd server && npm install
   ```
3. Set up model files (not included in the repository due to GitHub size limits):
   
   You need to download the following model files and place them in the correct locations:
   
   - `tower_classifier.pth` - Place in the root directory of the project
   - `UTD-Models-Videos/weights/yolov3.weights` - Place in the UTD-Models-Videos/weights directory

4. Start the backend server:
   ```
   cd server && node server.js
   ```
5. Start the frontend application:
   ```
   npm start
   ```

## Features

- Tower Classification: Identifies the type of cell tower from images (monopole, lattice, guyed, water tank)
- Modern UI with React and styled components
- Real-time analysis of uploaded images
- Image processing with PyTorch models

## Note about Large Files

The model files are not included in this repository due to GitHub's file size limitations (100MB max per file). The necessary files are:

- `tower_classifier.pth` (196MB)
- `UTD-Models-Videos/weights/yolov3.weights` (236MB)

These files need to be obtained separately and placed in the appropriate directories for the application to function correctly.

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
