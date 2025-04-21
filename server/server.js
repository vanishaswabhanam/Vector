const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3001;

// Enable CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

// Middleware to parse JSON
app.use(express.json());

// Store the latest sensor readings
let latestSensorData = {
  temperature: 0,
  rotation: 0,
  sound: 0,
  light: 0
};

// Endpoint to receive sensor data from Arduino
app.post('/api/sensor-data', (req, res) => {
  const { temperature, rotation, sound, light } = req.body;
  
  // Update latest readings
  latestSensorData = {
    temperature: parseFloat(temperature),
    rotation: parseInt(rotation),
    sound: parseInt(sound),
    light: parseInt(light)
  };
  
  console.log('Received sensor data:', latestSensorData);
  res.json({ success: true });
});

// Endpoint to get latest sensor data
app.get('/api/sensor-data', (req, res) => {
  res.json(latestSensorData);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
}); 