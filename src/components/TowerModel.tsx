import React, { useEffect, useRef } from 'react';
import styled from '@emotion/styled';

const ModelFrame = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 8px;
`;

interface TowerModelProps {
  towerType?: string;
}

const TowerModel: React.FC<TowerModelProps> = ({ towerType }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (towerType && iframeRef.current?.contentWindow) {
      // Convert the tower type to match the dropdown values
      let normalizedType = towerType.toLowerCase().split(' ')[0];
      
      // Send message to iframe to update the dropdown
      iframeRef.current.contentWindow.postMessage({
        type: 'selectTower',
        towerType: normalizedType
      }, '*');
    }
  }, [towerType]);

  return (
    <ModelFrame
      ref={iframeRef}
      src="/cell-tower-3d/index.html"
      title="3D Tower Model"
    />
  );
};

export default TowerModel; 