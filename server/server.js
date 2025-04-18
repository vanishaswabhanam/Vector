const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

const app = express();
const port = 3001;

// Enable CORS with more specific options
app.use(cors({
  origin: '*',  // Allow all origins
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json());

// Set up multer for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Root endpoint - show server info
app.get('/', (req, res) => {
  res.json({
    name: "Tower Classification API",
    version: "1.0",
    status: "Running",
    endpoints: [
      {
        path: "/api/status",
        method: "GET",
        description: "Check if server is running"
      },
      {
        path: "/api/model-path",
        method: "GET",
        description: "Check model file path and status"
      },
      {
        path: "/api/classify",
        method: "POST",
        description: "Upload and classify tower image"
      },
      {
        path: "/api/analyze",
        method: "POST",
        description: "Alias for /api/classify endpoint"
      }
    ]
  });
});

// Test endpoint to check if server is running
app.get('/api/status', (req, res) => {
  console.log('Status endpoint called');
  res.json({ status: 'running' });
});

// Test endpoint to see the model path
app.get('/api/model-path', (req, res) => {
  const modelPath = path.join(__dirname, '..', 'tower_classifier.pth');
  res.json({ 
    modelPath, 
    exists: fs.existsSync(modelPath),
    size: fs.existsSync(modelPath) ? fs.statSync(modelPath).size : null
  });
});

// Direct route alias for /api/analyze to /api/classify
app.post('/api/analyze', upload.single('image'), (req, res) => {
  console.log('Analyze endpoint called - forwarding to classify endpoint');
  
  // Simply call the /api/classify endpoint
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No file uploaded' });
  }

  console.log(`Processing file: ${req.file.path}`);
  
  const modelPath = path.join(__dirname, '..', 'tower_classifier.pth');
  const imagePath = req.file.path;

  // Verify file existence
  if (!fs.existsSync(modelPath)) {
    console.error(`Model file not found: ${modelPath}`);
    return res.status(500).json({
      success: false,
      error: 'Model file not found',
      details: `Could not find model at path: ${modelPath}`
    });
  }

  console.log(`Model path: ${modelPath}`);
  console.log(`Image path: ${imagePath}`);

  // Run Python script to classify the image
  const python = spawn('python3', [
    path.join(__dirname, 'model.py'),
    imagePath,
    modelPath
  ]);

  let pythonData = '';
  let pythonError = '';

  python.stdout.on('data', (data) => {
    const output = data.toString();
    console.log('Python stdout:', output);
    pythonData += output;
  });

  python.stderr.on('data', (data) => {
    const output = data.toString();
    console.error('Python stderr:', output);
    pythonError += output;
  });

  python.on('close', (code) => {
    console.log(`Python script exited with code ${code}`);
    
    // Clean up the uploaded file
    try {
      fs.unlinkSync(imagePath);
      console.log(`Deleted temporary file: ${imagePath}`);
    } catch (err) {
      console.error('Error deleting file:', err);
    }

    if (code !== 0) {
      console.error('Python error:', pythonError);
      return res.status(500).json({ 
        success: false, 
        error: 'Classification failed', 
        details: pythonError 
      });
    }

    try {
      // Clean and parse the output
      let jsonStr = pythonData.trim();
      
      // Find the first valid JSON string in the output
      // This handles cases where there might be other output before the JSON
      let firstOpenBrace = jsonStr.indexOf('{');
      let lastCloseBrace = jsonStr.lastIndexOf('}');
      
      if (firstOpenBrace !== -1 && lastCloseBrace !== -1) {
        jsonStr = jsonStr.substring(firstOpenBrace, lastCloseBrace + 1);
      }
      
      console.log('Final JSON string to parse:', jsonStr);
      
      const result = JSON.parse(jsonStr);
      
      // Format the result to match what the frontend expects
      const formattedResult = {
        success: result.success,
        towerClassification: result.success ? {
          tower_type: result.tower_type,
          confidence: result.confidence || null
        } : null,
        antennaDetection: null, // We don't have antenna detection
        errors: []
      };
      
      if (!result.success) {
        formattedResult.errors.push({
          source: 'tower_classification',
          message: result.error || 'Unknown error in tower classification'
        });
      }
      
      res.json(formattedResult);
    } catch (err) {
      console.error('Error parsing Python output:', err);
      res.status(500).json({ 
        success: false, 
        error: 'Error parsing classification results',
        details: pythonData,
        pythonError
      });
    }
  });
});

// Original endpoint for tower classification only
app.post('/api/classify', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No file uploaded' });
  }

  console.log(`Processing file: ${req.file.path}`);
  
  const modelPath = path.join(__dirname, '..', 'tower_classifier.pth');
  const imagePath = req.file.path;

  // Verify file existence
  if (!fs.existsSync(modelPath)) {
    console.error(`Model file not found: ${modelPath}`);
    return res.status(500).json({
      success: false,
      error: 'Model file not found',
      details: `Could not find model at path: ${modelPath}`
    });
  }

  console.log(`Model path: ${modelPath}`);
  console.log(`Image path: ${imagePath}`);

  // Run Python script to classify the image
  const python = spawn('python3', [
    path.join(__dirname, 'model.py'),
    imagePath,
    modelPath
  ]);

  let pythonData = '';
  let pythonError = '';

  python.stdout.on('data', (data) => {
    const output = data.toString();
    console.log('Python stdout:', output);
    pythonData += output;
  });

  python.stderr.on('data', (data) => {
    const output = data.toString();
    console.error('Python stderr:', output);
    pythonError += output;
  });

  python.on('close', (code) => {
    console.log(`Python script exited with code ${code}`);
    
    // Clean up the uploaded file
    try {
      fs.unlinkSync(imagePath);
      console.log(`Deleted temporary file: ${imagePath}`);
    } catch (err) {
      console.error('Error deleting file:', err);
    }

    if (code !== 0) {
      console.error('Python error:', pythonError);
      return res.status(500).json({ 
        success: false, 
        error: 'Classification failed', 
        details: pythonError 
      });
    }

    try {
      // Clean and parse the output
      let jsonStr = pythonData.trim();
      
      // Find the first valid JSON string in the output
      // This handles cases where there might be other output before the JSON
      let firstOpenBrace = jsonStr.indexOf('{');
      let lastCloseBrace = jsonStr.lastIndexOf('}');
      
      if (firstOpenBrace !== -1 && lastCloseBrace !== -1) {
        jsonStr = jsonStr.substring(firstOpenBrace, lastCloseBrace + 1);
      }
      
      console.log('Final JSON string to parse:', jsonStr);
      
      const result = JSON.parse(jsonStr);
      res.json(result);
    } catch (err) {
      console.error('Error parsing Python output:', err);
      res.status(500).json({ 
        success: false, 
        error: 'Error parsing classification results',
        details: pythonData,
        pythonError
      });
    }
  });
});

// Handle errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal server error'
  });
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Cannot ${req.method} ${req.path}`
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
}); 