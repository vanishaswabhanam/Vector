import React from 'react';
import styled from '@emotion/styled';
import TowerViewer from '../components/TowerViewer';

const PageContainer = styled.div`
  width: 100%;
  height: 100vh;
  padding: 0;
  margin: 0;
`;

const TowerView: React.FC = () => {
  return (
    <PageContainer>
      <TowerViewer />
    </PageContainer>
  );
};

export default TowerView; 