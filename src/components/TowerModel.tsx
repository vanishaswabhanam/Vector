import React, { useEffect, useRef } from 'react';
import styled from '@emotion/styled';

const ModelFrame = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 8px;
  min-height: 500px; /* Ensure minimum height */
  background: #f5f5f5;
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

  // Add resize handler
  useEffect(() => {
    const handleResize = () => {
      if (iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage({
          type: 'resize',
          width: iframeRef.current.clientWidth,
          height: iframeRef.current.clientHeight
        }, '*');
      }
    };

    window.addEventListener('resize', handleResize);
    // Initial resize
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <ModelFrame
      ref={iframeRef}
      src="/cell-tower-3d/index.html"
      title="3D Tower Model"
    />
  );
};

export default TowerModel; 