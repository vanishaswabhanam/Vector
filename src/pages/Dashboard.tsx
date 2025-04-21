import React, { useRef, useState, useEffect } from 'react';
import styled from '@emotion/styled';
import Header from '../components/Header';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix icon issues in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Thresholds for alerts
const THRESHOLDS = {
  temperature: { min: 20, max: 30 },
  sound: { min: 0, max: 200 },
  light: { min: 30, max: 80 }
};

// Sample sensor locations (we'll keep these static)
const sensorLocations = [
  { id: 9361, bands: 5, position: [47.7, -122.3] },
  { id: 107242, bands: 77, position: [41.8, -93.6] },
  { id: 119392, bands: 5, position: [37.7, -97.3] },
  { id: 117150, bands: 77, position: [37.7, -95.7] },
  { id: 127097, bands: 77, position: [34.0, -118.2] },
  { id: 147636, bands: 77, position: [35.2, -106.6] },
  { id: 42751, bands: 77, position: [39.1, -94.6] },
];

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
`;

const MapWrapper = styled.div`
  width: 90%;
  max-width: 1200px;
  height: 550px;
  margin-top: 2rem;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  
  .leaflet-container {
    width: 100%;
    height: 100%;
  }
`;

const SensorDataContainer = styled.div<{ isVisible: boolean }>`
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  width: 90%;
  max-width: 1200px;
  margin-top: 2rem;
  padding: 2rem;
  background: #f5f5f5;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  opacity: ${props => props.isVisible ? 1 : 0};
  visibility: ${props => props.isVisible ? 'visible' : 'hidden'};
  transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out;
`;

const SensorCard = styled.div<{ isAlert?: boolean }>`
  text-align: center;
  padding: 1.5rem;
  background: ${props => props.isAlert ? '#fff3f3' : 'white'};
  border-radius: 8px;
  margin: 0.5rem;
  min-width: 200px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  border: 2px solid ${props => props.isAlert ? '#ff4444' : 'transparent'};
  transition: all 0.3s ease;
  
  h3 {
    margin: 0 0 0.5rem 0;
    color: #333;
  }
  
  p {
    font-size: 1.5rem;
    font-weight: bold;
    color: ${props => props.isAlert ? '#ff4444' : '#2c5282'};
    margin: 0;
  }
`;

const AlertMessage = styled.div`
  font-size: 0.875rem;
  color: #ff4444;
  margin-top: 0.5rem;
`;

const MarkerLabel = styled.div`
  background: white;
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-weight: bold;
  font-size: 12px;
  white-space: nowrap;
`;

const GraphContainer = styled.div`
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  width: 90%;
  max-width: 1200px;
  margin-top: 2rem;
  padding: 2rem;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const GraphCard = styled.div`
  width: calc(50% - 2rem);
  min-width: 300px;
  margin: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);

  h3 {
    margin: 0 0 1rem 0;
    color: #333;
    text-align: center;
  }
`;

interface SensorData {
  temperature: number;
  rotation: number;
  sound: number;
  light: number;
  timestamp?: number;
}

// Add these type definitions at the top of the file
type TimeFormatter = (timestamp: number) => string;
type ValueFormatter = (value: number) => [string, string];

const Dashboard: React.FC = () => {
  const [showSensorData, setShowSensorData] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(sensorLocations[0]);
  const [sensorData, setSensorData] = useState<SensorData>({
    temperature: 0,
    rotation: 0,
    sound: 0,
    light: 0
  });
  const [historicalData, setHistoricalData] = useState<SensorData[]>([]);
  
  const sensorDataRef = useRef<HTMLDivElement>(null);

  const checkThreshold = (value: number, type: 'temperature' | 'sound' | 'light') => {
    const threshold = THRESHOLDS[type];
    return value < threshold.min || value > threshold.max;
  };

  const getAlertMessage = (value: number, type: 'temperature' | 'sound' | 'light') => {
    const threshold = THRESHOLDS[type];
    if (value < threshold.min) {
      return `${type.charAt(0).toUpperCase() + type.slice(1)} is too low`;
    }
    if (value > threshold.max) {
      return `${type.charAt(0).toUpperCase() + type.slice(1)} is too high`;
    }
    return '';
  };

  // Fetch sensor data periodically
  useEffect(() => {
    const fetchSensorData = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/sensor-data');
        const data = await response.json();
        setSensorData(data);
        
        // Add timestamp and update historical data
        const timestampedData = { ...data, timestamp: Date.now() };
        setHistoricalData(prev => {
          const newData = [...prev, timestampedData];
          // Keep last 30 readings
          return newData.slice(-30);
        });
      } catch (error) {
        console.error('Failed to fetch sensor data:', error);
      }
    };

    // Fetch immediately
    fetchSensorData();

    // Then fetch every second
    const interval = setInterval(fetchSensorData, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleLocationSelect = (location: typeof sensorLocations[0]) => {
    setSelectedLocation(location);
    setShowSensorData(true);
    setTimeout(() => {
      sensorDataRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <DashboardContainer>
      <Header />
      <MapWrapper>
        <MapContainer 
          center={[39.8, -98.5]} 
          zoom={4} 
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {sensorLocations.map((location) => (
            <Marker 
              key={location.id}
              position={location.position as [number, number]}
              eventHandlers={{
                click: () => handleLocationSelect(location),
              }}
            >
              <Popup>
                <MarkerLabel>
                  {location.id}<br />
                  Bands {location.bands}
                </MarkerLabel>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </MapWrapper>
      
      <SensorDataContainer ref={sensorDataRef} isVisible={showSensorData}>
        <SensorCard isAlert={checkThreshold(sensorData.temperature, 'temperature')}>
          <h3>Temperature</h3>
          <p>{sensorData.temperature.toFixed(2)}°C</p>
          {checkThreshold(sensorData.temperature, 'temperature') && (
            <AlertMessage>
              {getAlertMessage(sensorData.temperature, 'temperature')}
            </AlertMessage>
          )}
        </SensorCard>
        <SensorCard isAlert={checkThreshold(sensorData.light, 'light')}>
          <h3>Light</h3>
          <p>{sensorData.light} lux</p>
          {checkThreshold(sensorData.light, 'light') && (
            <AlertMessage>
              {getAlertMessage(sensorData.light, 'light')}
            </AlertMessage>
          )}
        </SensorCard>
        <SensorCard isAlert={checkThreshold(sensorData.sound, 'sound')}>
          <h3>Sound</h3>
          <p>{sensorData.sound} dB</p>
          {checkThreshold(sensorData.sound, 'sound') && (
            <AlertMessage>
              {getAlertMessage(sensorData.sound, 'sound')}
            </AlertMessage>
          )}
        </SensorCard>
        <SensorCard>
          <h3>Rotation</h3>
          <p>{sensorData.rotation}°</p>
        </SensorCard>
      </SensorDataContainer>

      <GraphContainer>
        <GraphCard>
          <h3>Temperature History</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={historicalData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={(timestamp: number) => new Date(timestamp).toLocaleTimeString()}
                interval="preserveStartEnd"
              />
              <YAxis domain={['auto', 'auto']} />
              <Tooltip 
                labelFormatter={(timestamp: number) => new Date(timestamp).toLocaleTimeString()}
                formatter={(value: number) => [`${value.toFixed(2)}°C`, 'Temperature']}
              />
              <Line 
                type="monotone" 
                dataKey="temperature" 
                stroke="#2c5282" 
                dot={false} 
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </GraphCard>

        <GraphCard>
          <h3>Light Level History</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={historicalData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={(timestamp: number) => new Date(timestamp).toLocaleTimeString()}
                interval="preserveStartEnd"
              />
              <YAxis domain={['auto', 'auto']} />
              <Tooltip 
                labelFormatter={(timestamp: number) => new Date(timestamp).toLocaleTimeString()}
                formatter={(value: number) => [`${value} lux`, 'Light']}
              />
              <Line 
                type="monotone" 
                dataKey="light" 
                stroke="#ecc94b" 
                dot={false} 
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </GraphCard>

        <GraphCard>
          <h3>Sound Level History</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={historicalData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={(timestamp: number) => new Date(timestamp).toLocaleTimeString()}
                interval="preserveStartEnd"
              />
              <YAxis domain={['auto', 'auto']} />
              <Tooltip 
                labelFormatter={(timestamp: number) => new Date(timestamp).toLocaleTimeString()}
                formatter={(value: number) => [`${value} dB`, 'Sound']}
              />
              <Line 
                type="monotone" 
                dataKey="sound" 
                stroke="#805ad5" 
                dot={false} 
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </GraphCard>

        <GraphCard>
          <h3>Rotation History</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={historicalData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={(timestamp: number) => new Date(timestamp).toLocaleTimeString()}
                interval="preserveStartEnd"
              />
              <YAxis domain={['auto', 'auto']} />
              <Tooltip 
                labelFormatter={(timestamp: number) => new Date(timestamp).toLocaleTimeString()}
                formatter={(value: number) => [`${value}°`, 'Rotation']}
              />
              <Line 
                type="monotone" 
                dataKey="rotation" 
                stroke="#e53e3e" 
                dot={false} 
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </GraphCard>
      </GraphContainer>
    </DashboardContainer>
  );
};

export default Dashboard; 