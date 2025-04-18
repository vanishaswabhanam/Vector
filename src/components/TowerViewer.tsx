import React, { useEffect } from 'react';

const TowerViewer: React.FC = () => {
  useEffect(() => {
    // Redirect to the cell-tower-3d viewer directly
    window.location.href = '/cell-tower-3d/index.html';
  }, []);

  return null;
};

export default TowerViewer; 