import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 0;
`;

const Hero = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  background: linear-gradient(135deg, #4299e1 0%, #2b6cb0 100%);
  border-radius: 10px;
  margin-bottom: 3rem;
  padding: 2rem;
  color: white;
  text-align: center;
`;

const HeroContent = styled.div`
  max-width: 800px;
  
  h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }
  
  p {
    font-size: 1.25rem;
    margin-bottom: 2rem;
    opacity: 0.9;
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
`;

const Button = styled.button`
  background-color: white;
  color: #2b6cb0;
  font-weight: bold;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

const FeaturesSection = styled.section`
  margin-bottom: 3rem;
  
  h2 {
    text-align: center;
    margin-bottom: 2rem;
    font-size: 2rem;
    color: #2c5282;
  }
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
`;

const FeatureCard = styled.div`
  background-color: #fff;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  }
  
  h3 {
    margin-top: 0;
    margin-bottom: 0.75rem;
    color: #2c5282;
  }
  
  p {
    margin-bottom: 0;
    color: #4a5568;
  }
`;

const HowItWorks = styled.section`
  margin-bottom: 4rem;
  
  h2 {
    text-align: center;
    margin-bottom: 2rem;
    font-size: 2rem;
    color: #2c5282;
  }
`;

const Steps = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 800px;
  margin: 0 auto;
`;

const Step = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  
  .step-number {
    background-color: #4299e1;
    color: white;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    flex-shrink: 0;
  }
  
  .step-content {
    h3 {
      margin-top: 0;
      margin-bottom: 0.5rem;
      color: #2c5282;
    }
    
    p {
      margin: 0;
      color: #4a5568;
    }
  }
`;

const Home: React.FC = () => {
  return (
    <Container>
      <Header />
      <Hero>
        <HeroContent>
          <h1>Vector Cell Tower Classifier</h1>
          <p>Advanced deep learning to identify cell tower types and antennas from images</p>
          <StyledLink to="/upload">
            <Button>Get Started</Button>
          </StyledLink>
        </HeroContent>
      </Hero>
      
      <FeaturesSection>
        <h2>Features</h2>
        <FeatureGrid>
          <FeatureCard>
            <h3>Tower Classification</h3>
            <p>Identify the type of cell tower from images using our trained deep learning model.</p>
          </FeatureCard>
          
          <FeatureCard>
            <h3>Antenna Detection</h3>
            <p>Detect and classify different types of antennas present on the tower, including GSM and Microwave antennas.</p>
          </FeatureCard>
          
          <FeatureCard>
            <h3>Visual Results</h3>
            <p>View detailed bounding boxes around detected antennas with color-coded labels for easy identification.</p>
          </FeatureCard>
          
          <FeatureCard>
            <h3>Detailed Analysis</h3>
            <p>Get a comprehensive summary of all detected objects with counts for each antenna type.</p>
          </FeatureCard>
        </FeatureGrid>
      </FeaturesSection>
      
      <HowItWorks>
        <h2>How It Works</h2>
        <Steps>
          <Step>
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>Upload Image</h3>
              <p>Upload an image of a cell tower through our user-friendly interface.</p>
            </div>
          </Step>
          
          <Step>
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>AI Processing</h3>
              <p>Our deep learning models analyze the image to classify the tower type and detect antennas.</p>
            </div>
          </Step>
          
          <Step>
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>View Results</h3>
              <p>Review tower classification and antenna detection results with visual annotations.</p>
            </div>
          </Step>
        </Steps>
      </HowItWorks>
    </Container>
  );
};

export default Home; 