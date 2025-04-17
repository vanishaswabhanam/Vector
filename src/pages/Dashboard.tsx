import React, { useRef, useState } from 'react';
import styled from '@emotion/styled';
import Header from '../components/Header';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix icon issues in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Sample sensor data
const sensorData = [
  { id: 9361, bands: 5, position: [47.7, -122.3], reading: { temp: 24, light: 800, sound: 45, rotation: 180 } },
  { id: 107242, bands: 77, position: [41.8, -93.6], reading: { temp: 26, light: 950, sound: 55, rotation: 90 } },
  { id: 119392, bands: 5, position: [37.7, -97.3], reading: { temp: 29, light: 1050, sound: 60, rotation: 270 } },
  { id: 117150, bands: 77, position: [37.7, -95.7], reading: { temp: 23, light: 750, sound: 40, rotation: 45 } },
  { id: 127097, bands: 77, position: [34.0, -118.2], reading: { temp: 21, light: 600, sound: 50, rotation: 120 } },
  { id: 147636, bands: 77, position: [35.2, -106.6], reading: { temp: 28, light: 890, sound: 35, rotation: 210 } },
  { id: 42751, bands: 77, position: [39.1, -94.6], reading: { temp: 22, light: 720, sound: 48, rotation: 135 } },
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

const SensorCard = styled.div`
  text-align: center;
  padding: 1rem;
  
  h3 {
    margin: 0 0 0.5rem 0;
    color: #333;
  }
  
  p {
    font-size: 1.5rem;
    font-weight: bold;
    color: #2c5282;
    margin: 0;
  }
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

const Dashboard: React.FC = () => {
  const [showSensorData, setShowSensorData] = useState(false);
  const [selectedSensor, setSelectedSensor] = useState(sensorData[0]);
  const sensorDataRef = useRef<HTMLDivElement>(null);

  const handleSensorSelect = (sensor: typeof sensorData[0]) => {
    setSelectedSensor(sensor);
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
          {sensorData.map((sensor) => (
            <Marker 
              key={sensor.id}
              position={sensor.position as [number, number]}
              eventHandlers={{
                click: () => handleSensorSelect(sensor),
              }}
            >
              <Popup>
                <MarkerLabel>
                  {sensor.id}<br />
                  Bands {sensor.bands}
                </MarkerLabel>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </MapWrapper>
      
      <SensorDataContainer ref={sensorDataRef} isVisible={showSensorData}>
        <SensorCard>
          <h3>Temperature</h3>
          <p>{selectedSensor.reading.temp}°C</p>
        </SensorCard>
        <SensorCard>
          <h3>Light</h3>
          <p>{selectedSensor.reading.light} lux</p>
        </SensorCard>
        <SensorCard>
          <h3>Sound</h3>
          <p>{selectedSensor.reading.sound} dB</p>
        </SensorCard>
        <SensorCard>
          <h3>Rotation</h3>
          <p>{selectedSensor.reading.rotation}°</p>
        </SensorCard>
      </SensorDataContainer>
    </DashboardContainer>
  );
};

export default Dashboard; 