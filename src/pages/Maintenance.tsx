import React, { useState } from 'react';
import styled from '@emotion/styled';
import Header from '../components/Header';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.div`
  display: flex;
  flex: 1;
  padding: 2rem;
  gap: 2rem;
`;

const MaintenanceColumns = styled.div`
  display: flex;
  gap: 2rem;
  width: 75%;
`;

const MaintenanceColumn = styled.div<{ bgColor: string }>`
  flex: 1;
  background-color: ${props => props.bgColor};
  border-radius: 8px;
  padding: 2rem;
  height: calc(100vh - 200px);
  overflow-y: auto;

  h2 {
    font-size: 1.8rem;
    margin: 0 0 2rem 0;
    text-align: center;
  }
`;

const SearchSection = styled.div`
  width: 25%;
  background-color: #E5E5E5;
  border-radius: 8px;
  padding: 2rem;

  h2 {
    font-size: 1.5rem;
    margin: 0 0 1.5rem 0;
    text-align: center;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-size: 1rem;
`;

const SearchResults = styled.div`
  margin-top: 1rem;
`;

const MaintenanceItem = styled.div`
  background: white;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const Maintenance: React.FC = () => {
  const [searchTower, setSearchTower] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTower(value);
    // Mock search results - replace with actual API call later
    if (value) {
      setSearchResults([
        `Tower ${value} - Battery Replacement - 01/15/2024`,
        `Tower ${value} - Solar Panel Cleaning - 12/20/2023`,
        `Tower ${value} - Sensor Calibration - 11/05/2023`,
      ]);
    } else {
      setSearchResults([]);
    }
  };

  return (
    <Container>
      <Header />
      <MainContent>
        <MaintenanceColumns>
          <MaintenanceColumn bgColor="#FFD6D6">
            <h2>URGENT MAINTENANCE</h2>
            <MaintenanceItem>
              <h3>Tower 117150 - Critical Battery Level</h3>
              <p>Battery level below 10%. Immediate replacement required.</p>
            </MaintenanceItem>
            <MaintenanceItem>
              <h3>Tower 42751 - Sensor Malfunction</h3>
              <p>Temperature sensor reporting incorrect values.</p>
            </MaintenanceItem>
          </MaintenanceColumn>
          
          <MaintenanceColumn bgColor="#FFFCD6">
            <h2>RECOMMENDED MAINTENANCE</h2>
            <MaintenanceItem>
              <h3>Tower 9361 - Scheduled Cleaning</h3>
              <p>Solar panel cleaning due in 5 days.</p>
            </MaintenanceItem>
            <MaintenanceItem>
              <h3>Tower 147636 - Calibration Check</h3>
              <p>Regular sensor calibration scheduled for next week.</p>
            </MaintenanceItem>
          </MaintenanceColumn>
        </MaintenanceColumns>

        <SearchSection>
          <h2>History log:</h2>
          <p>search for tower number</p>
          <SearchInput
            type="text"
            placeholder="Enter tower number..."
            value={searchTower}
            onChange={handleSearch}
          />
          <SearchResults>
            {searchResults.map((result, index) => (
              <MaintenanceItem key={index}>
                {result}
              </MaintenanceItem>
            ))}
          </SearchResults>
        </SearchSection>
      </MainContent>
    </Container>
  );
};

export default Maintenance; 