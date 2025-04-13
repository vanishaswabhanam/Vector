import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from '@emotion/styled';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import MediaUpload from './pages/MediaUpload';
import Maintenance from './pages/Maintenance';

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: white;
`;

function App() {
  return (
    <Router>
      <AppContainer>
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/media" element={<MediaUpload />} />
          <Route path="/maintenance" element={<Maintenance />} />
        </Routes>
      </AppContainer>
    </Router>
  );
}

export default App;
