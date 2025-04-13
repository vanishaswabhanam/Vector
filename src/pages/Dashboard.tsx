import React, { useRef, useState } from 'react';
import styled from '@emotion/styled';
import Header from '../components/Header';

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
`;

const MapContainer = styled.div`
  width: 90%;
  max-width: 1200px;
  cursor: pointer;
  margin-top: 2rem;
  
  img {
    width: 100%;
    height: auto;
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

const Dashboard: React.FC = () => {
  const [showSensorData, setShowSensorData] = useState(false);
  const sensorDataRef = useRef<HTMLDivElement>(null);

  const handleMapClick = () => {
    setShowSensorData(true);
    setTimeout(() => {
      sensorDataRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <DashboardContainer>
      <Header />
      <MapContainer onClick={handleMapClick}>
        <img src="/sensor-map.png" alt="Sensor Map" />
      </MapContainer>
      
      <SensorDataContainer ref={sensorDataRef} isVisible={showSensorData}>
        <SensorCard>
          <h3>Temperature</h3>
          <p>24°C</p>
        </SensorCard>
        <SensorCard>
          <h3>Light</h3>
          <p>800 lux</p>
        </SensorCard>
        <SensorCard>
          <h3>Sound</h3>
          <p>45 dB</p>
        </SensorCard>
        <SensorCard>
          <h3>Rotation</h3>
          <p>180°</p>
        </SensorCard>
      </SensorDataContainer>
    </DashboardContainer>
  );
};

export default Dashboard; 