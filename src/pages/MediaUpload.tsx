import React, { useState, useRef, useEffect } from 'react';
import styled from '@emotion/styled';
import Header from '../components/Header';
import axios from 'axios';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
`;

const Content = styled.div`
  padding: 2rem;
  width: 90%;
  max-width: 1200px;
  margin-top: 2rem;
`;

const Title = styled.h1`
  color: #333;
  font-size: 2rem;
  margin-bottom: 20px;
`;

const UploadArea = styled.div<{ isDragging: boolean }>`
  border: 2px dashed ${props => props.isDragging ? '#ff0000' : '#ccc'};
  border-radius: 8px;
  padding: 40px;
  text-align: center;
  margin-top: 20px;
  background-color: ${props => props.isDragging ? '#fff' : '#f9f9f9'};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #ff0000;
    background-color: #fff;
  }
`;

const ImageContainer = styled.div`
  margin-top: 20px;
  text-align: center;
  position: relative;
  display: inline-block;
`;

const StyledImage = styled.img`
  max-width: 100%;
  max-height: 500px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const BoundingBox = styled.div<{ 
  x: number; 
  y: number; 
  width: number; 
  height: number; 
  classType: string;
}>`
  position: absolute;
  border: 2px solid ${props => {
    switch(props.classType) {
      case 'GSM Antenna': return '#FF5733';
      case 'Microwave Antenna': return '#33FF57';
      case 'antenna': return '#3357FF';
      case 'Lattice Tower': return '#FF33E6';
      case 'M Type Tower': return '#33FFE6';
      default: return '#FFFF33';
    }
  }};
  border-radius: 4px;
  left: ${props => props.x}px;
  top: ${props => props.y}px;
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  pointer-events: none;
  
  &::before {
    content: '${props => props.classType}';
    position: absolute;
    top: -25px;
    left: 0;
    background-color: ${props => {
      switch(props.classType) {
        case 'GSM Antenna': return '#FF5733';
        case 'Microwave Antenna': return '#33FF57';
        case 'antenna': return '#3357FF';
        case 'Lattice Tower': return '#FF33E6';
        case 'M Type Tower': return '#33FFE6';
        default: return '#FFFF33';
      }
    }};
    color: white;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 12px;
    white-space: nowrap;
  }
`;

const ClassificationResult = styled.div`
  margin-top: 20px;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const TowerType = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #2c5282;
  
  span {
    text-transform: capitalize;
  }
`;

const DetectionSummary = styled.div`
  margin-top: 20px;
  font-size: 1rem;
  
  ul {
    list-style-type: none;
    padding: 0;
    margin: 10px 0 0 0;
  }
  
  li {
    margin-bottom: 5px;
    padding: 5px 10px;
    border-radius: 4px;
    background-color: #f0f0f0;
    display: flex;
    justify-content: space-between;
    
    .count {
      font-weight: bold;
      color: #2c5282;
    }
  }
`;

const ErrorMessage = styled.div`
  margin-top: 20px;
  padding: 15px;
  background-color: #fed7d7;
  color: #9b2c2c;
  border-radius: 4px;
  white-space: pre-wrap;
  overflow-x: auto;
`;

const DetailedError = styled.details`
  margin-top: 10px;
  
  summary {
    cursor: pointer;
    font-weight: bold;
    margin-bottom: 5px;
  }
  
  pre {
    background-color: #fff;
    padding: 10px;
    border-radius: 4px;
    overflow-x: auto;
    font-size: 0.85rem;
    color: #555;
    margin-top: 5px;
    border: 1px solid #ddd;
  }
`;

const LoadingIndicator = styled.div`
  margin-top: 20px;
  padding: 20px;
  text-align: center;
  
  .spinner {
    border: 4px solid rgba(0, 0, 0, 0.1);
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border-left-color: #ff0000;
    margin: 0 auto 10px;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ServerStatus = styled.div<{ isOnline: boolean }>`
  position: fixed;
  bottom: 10px;
  right: 10px;
  padding: 5px 10px;
  border-radius: 4px;
  background-color: ${props => props.isOnline ? '#c6f6d5' : '#fed7d7'};
  color: ${props => props.isOnline ? '#276749' : '#9b2c2c'};
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  z-index: 1000;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  &::before {
    content: '';
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: ${props => props.isOnline ? '#38a169' : '#e53e3e'};
    margin-right: 5px;
  }
`;

const RetryButton = styled.button`
  background-color: #3182ce;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  margin-top: 10px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #2b6cb0;
  }
`;

const ToggleButton = styled.button`
  background-color: #4a5568;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  margin-right: 10px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #2d3748;
  }
  
  &.active {
    background-color: #2c5282;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  margin-top: 20px;
`;

interface Detection {
  class: string;
  confidence: number;
  bbox: [number, number, number, number]; // [x1, y1, x2, y2]
}

interface ImageSize {
  width: number;
  height: number;
}

interface AnalysisResponse {
  success: boolean;
  towerClassification?: {
    tower_type: string;
  } | null;
  antennaDetection?: {
    detections: Detection[];
    image_size: ImageSize;
  } | null;
  errors?: Array<{
    source: string;
    message: string;
  }>;
  error?: string;
}

const MediaUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [serverOnline, setServerOnline] = useState<boolean | null>(null);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [showBoundingBoxes, setShowBoundingBoxes] = useState(true);
  const [imageContainerSize, setImageContainerSize] = useState<{width: number, height: number}>({width: 0, height: 0});
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  // Check if server is online
  const checkServerStatus = async () => {
    try {
      setIsCheckingStatus(true);
      await axios.get('http://localhost:3001/api/status', { timeout: 5000 });
      setServerOnline(true);
      return true;
    } catch (err) {
      console.error('Server status check failed:', err);
      setServerOnline(false);
      return false;
    } finally {
      setIsCheckingStatus(false);
    }
  };

  useEffect(() => {
    checkServerStatus();
    const interval = setInterval(checkServerStatus, 10000);
    
    return () => clearInterval(interval);
  }, []);

  // Update image container size when the image loads
  useEffect(() => {
    if (imageRef.current && imageContainerRef.current) {
      setImageContainerSize({
        width: imageRef.current.offsetWidth,
        height: imageRef.current.offsetHeight
      });
    }
  }, [preview, analysisResult]);

  const handleRetryConnection = () => {
    checkServerStatus();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    handleSelectedFile(selectedFile);
  };

  const handleSelectedFile = (selectedFile: File | undefined) => {
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setAnalysisResult(null);
      setError(null);
      setErrorDetails(null);
      
      // Only submit if server is online
      if (serverOnline) {
        submitForAnalysis(selectedFile);
      } else {
        setError('Server is offline. Please start the server and try again.');
      }
    }
  };

  const submitForAnalysis = async (selectedFile: File) => {
    // Double-check server is online before submitting
    const isOnline = await checkServerStatus();
    if (!isOnline) {
      setError('Server is offline. Please start the server and try again.');
      return;
    }
    
    setIsLoading(true);
    setAnalysisResult(null);
    setError(null);
    setErrorDetails(null);
    
    const formData = new FormData();
    formData.append('image', selectedFile);
    
    try {
      const response = await axios.post<AnalysisResponse>(
        'http://localhost:3001/api/analyze',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 60000 // 60 seconds timeout (antenna detection can take longer)
        }
      );
      
      setAnalysisResult(response.data);
      
      if (!response.data.success) {
        const errorMessages = response.data.errors?.map(e => e.message).join('\n') || response.data.error || 'Analysis failed';
        setError(errorMessages);
      }
    } catch (err) {
      console.error('Error analyzing image:', err);
      
      if (axios.isAxiosError(err)) {
        if (err.code === 'ECONNABORTED') {
          setError('The analysis request timed out. The models may be taking too long to process.');
        } else if (err.response) {
          if (err.response.status === 404) {
            setError('Cannot connect to API endpoint. Please ensure the server is running and the /api/analyze endpoint is available.');
            setServerOnline(false);
          } else {
            setError(`Failed to analyze image: ${err.response.data.error || 'Server error'}`);
            setErrorDetails(err.response.data.details || JSON.stringify(err.response.data));
          }
        } else if (err.request) {
          setError('No response from server. Server may be offline or not properly configured for CORS.');
          setServerOnline(false);
        } else {
          setError(`Error: ${err.message}`);
        }
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files?.[0];
    handleSelectedFile(droppedFile);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageLoad = () => {
    if (imageRef.current && imageContainerRef.current) {
      setImageContainerSize({
        width: imageRef.current.offsetWidth,
        height: imageRef.current.offsetHeight
      });
    }
  };

  // Calculate scaled bounding box positions
  const calculateBoundingBoxPositions = (
    bbox: [number, number, number, number],
    originalSize: ImageSize,
    containerSize: {width: number, height: number}
  ) => {
    const [x1, y1, x2, y2] = bbox;
    const scaleX = containerSize.width / originalSize.width;
    const scaleY = containerSize.height / originalSize.height;
    
    return {
      x: x1 * scaleX,
      y: y1 * scaleY,
      width: (x2 - x1) * scaleX,
      height: (y2 - y1) * scaleY
    };
  };

  // Count detections by class
  const getDetectionCounts = () => {
    if (!analysisResult?.antennaDetection?.detections) return {};
    
    const counts: {[key: string]: number} = {};
    analysisResult.antennaDetection.detections.forEach(detection => {
      counts[detection.class] = (counts[detection.class] || 0) + 1;
    });
    
    return counts;
  };
  
  // Toggle bounding boxes
  const toggleBoundingBoxes = () => {
    setShowBoundingBoxes(!showBoundingBoxes);
  };

  return (
    <Container>
      <Header />
      <Content>
        <Title>Tower Classification & Antenna Detection</Title>
        <p>Upload an image of a tower to identify its type and detect antennas.</p>
        
        <UploadArea 
          isDragging={isDragging}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <p>Click or drag files here to upload</p>
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            style={{ display: 'none' }}
          />
        </UploadArea>
        
        {preview && (
          <ImageContainer ref={imageContainerRef}>
            <StyledImage 
              ref={imageRef} 
              src={preview} 
              alt="Uploaded tower" 
              onLoad={handleImageLoad}
            />
            
            {showBoundingBoxes && 
             analysisResult?.antennaDetection?.detections && 
             analysisResult.antennaDetection.image_size &&
             analysisResult.antennaDetection.detections.map((detection, index) => {
              const { x, y, width, height } = calculateBoundingBoxPositions(
                detection.bbox,
                analysisResult.antennaDetection!.image_size,
                imageContainerSize
              );
              
              return (
                <BoundingBox
                  key={index}
                  x={x}
                  y={y}
                  width={width}
                  height={height}
                  classType={detection.class}
                />
              );
            })}
          </ImageContainer>
        )}
        
        {isLoading && (
          <LoadingIndicator>
            <div className="spinner"></div>
            <p>Analyzing image...</p>
          </LoadingIndicator>
        )}
        
        {analysisResult?.success && (
          <>
            {analysisResult.towerClassification && (
              <ClassificationResult>
                <TowerType>
                  Tower Type: <span>{analysisResult.towerClassification.tower_type}</span>
                </TowerType>
              </ClassificationResult>
            )}
            
            {analysisResult.antennaDetection?.detections && 
             analysisResult.antennaDetection.detections.length > 0 && (
              <>
                <ButtonGroup>
                  <ToggleButton 
                    onClick={toggleBoundingBoxes}
                    className={showBoundingBoxes ? 'active' : ''}
                  >
                    {showBoundingBoxes ? 'Hide' : 'Show'} Bounding Boxes
                  </ToggleButton>
                </ButtonGroup>
                
                <DetectionSummary>
                  <h3>Detection Summary:</h3>
                  <ul>
                    {Object.entries(getDetectionCounts()).map(([className, count]) => (
                      <li key={className}>
                        <span>{className}</span>
                        <span className="count">{count}</span>
                      </li>
                    ))}
                  </ul>
                </DetectionSummary>
              </>
            )}
          </>
        )}
        
        {error && (
          <ErrorMessage>
            {error}
            {!serverOnline && (
              <div style={{ marginTop: '10px' }}>
                <RetryButton onClick={handleRetryConnection} disabled={isCheckingStatus}>
                  {isCheckingStatus ? 'Checking...' : 'Retry Connection'}
                </RetryButton>
              </div>
            )}
            {errorDetails && (
              <DetailedError>
                <summary>Technical Details</summary>
                <pre>{errorDetails}</pre>
              </DetailedError>
            )}
          </ErrorMessage>
        )}
      </Content>
      
      {serverOnline !== null && (
        <ServerStatus 
          isOnline={serverOnline}
          onClick={handleRetryConnection}
          title={serverOnline ? 'Server is online' : 'Click to retry connection'}
        >
          Server {serverOnline ? 'Online' : 'Offline'}
        </ServerStatus>
      )}
    </Container>
  );
};

export default MediaUpload; 