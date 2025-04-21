import React, { useState, useRef } from 'react';
import styled from '@emotion/styled';
import Header from '../components/Header';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
`;

const UploadSection = styled.div`
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
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

const TowerType = styled.div`
  margin-top: 15px;
  font-size: 1.5rem;
  font-weight: bold;
  color: #2c5282;
  text-transform: capitalize;
`;

// Function to find tower type from training data
const findTowerType = (fileName: string): string => {
  // Map of filenames to their tower types
  const fileToTowerType: { [key: string]: string } = {
    // Guyed towers
    'pc73320378-telecommunication_free_standing_lattice_tower_4_legged.jpg': 'guyed',
    'hellohello.jpg': 'guyed',
    'not-often-seeing-a-guyed-cell-tower-v0-n0zv8hj1sihd1.jpg': 'guyed',
    'pc34731666-4_leg_high_angular_guyed_wire_towers_55m_for_gsm_5g_antennas.jpg': 'guyed',
    'pc35668713-40m_high_mast_guyed_wire_self_supporting_lattice_tower_galvanized_steel.jpg': 'guyed',
    'Steel-Guyed-Communication-Cell-Round-Steel-Tower.jpg': 'guyed',
    'are-these-usually-for-phone-cell-towers-or-just-a-tall-tower-v0-hftjff39lzcb1.jpg': 'guyed',
    'bf8661d032b7d296301ddad9b21bf78a_small.jpg': 'guyed',
    'closer-750x465.jpg': 'guyed',
    'def7d89a7655227e664588ecf2fcb96f.jpg': 'guyed',
    'LAttice.png': 'guyed',
    'IMG_3852cropped.jpg': 'guyed',
    'Guywire.jpg': 'guyed',
    'G-30 Guytower with 4 carriers.jpg': 'guyed',
    'G-42 Guyed tower with 2 carriers.jpg': 'guyed',
    'GUYED-TOWER-min-768x1024.jpg': 'guyed',
    'Galvanized-Steel-Bar-Guyed-Radio-Cell-Tower.jpg': 'guyed',
    '831fe60f50b6c7f5.jpg_20190801155735_570x760.jpeg': 'guyed',
    'CAMERA-MOUNTED-min.jpg': 'guyed',
    'CellTowers.jpg': 'guyed',
    'G-30 Guyed tower with multiple carriers.jpg': 'guyed',
    '6760f1182776b.jpg': 'guyed',
    '6760f1182776b (1).jpg': 'guyed',
    '0047_jpg.rf.d9046d5fc02e0013bd4ba12e44dad63a.jpg': 'guyed',
    '3-Legs-Guyed-Mast-Cell-Phone-Telecommunication-Tower.jpg': 'guyed',
    '6405b3e53b66b.jpg': 'guyed',
    '0043_jpg.rf.29bb76f4a351e7cb8e0e1d3d3662a551.jpg': 'guyed',

    // Lattice towers
    'steel-lattice-tower-2.jpg': 'lattice',
    'steel-lattice-tower-transmission-tower-power-tower.jpg': 'lattice',
    'ezgif-frame-072_jpg.rf.a1178b9ca692efb4b87e314e1ec1ca25.jpg': 'lattice',
    'images-34-_jpg.rf.42a9b10cd3bdba634e2cd9d015b45df6.jpg': 'lattice',
    'images-53-_jpg.rf.ae24bc74df861ecfaf5aa8dd5aaf6871.jpg': 'lattice',
    'pc73320378-telecommunication_free_standing_lattice_tower_4_legged (1).jpg': 'lattice',
    'pt33160272-30m_s_triangular_self_supporting_lattice_tower_telecom.jpg': 'lattice',
    'ezgif-frame-067_jpg.rf.f0014abf33cccaec5a99bb316b9a3e8d.jpg': 'lattice',
    'ezgif-frame-015_jpg.rf.a140309a7a8c79af8188ddb2cd4111fc.jpg': 'lattice',
    'ezgif-frame-019_jpg.rf.f94254dea85bf96ea01a1106ed7305ab.jpg': 'lattice',
    'BJ13E040049_jpg.rf.fbf88afee3369804b98783749e81a144.jpg': 'lattice',
    'Electric-Power-Transmission-Tower-Galvanization-Transmission-Steel-Lattice-Tower.jpg': 'lattice',
    'LAttice (1).png': 'lattice',
    'LWE_1_jpeg.rf.805c15d82373d4a776ffc82609506950.jpg': 'lattice',
    'cell_tower_lattice-2.jpg': 'lattice',
    '-F483E62A-76B6-4FEF-BBE7-E8286922C391-_jpg.rf.8625604717e0687bef933d1ce3969e6c.jpg': 'lattice',
    '4-Leged-Steel-Lattice-Telecom-Cell-Tower.jpg': 'lattice',
    '686b07_7e3c832ce34f4b1698fad7e469b65b74~mv2.jpg': 'lattice',
    'Antennas-mounted-on-a-lattice-tower-on-the-left-antennas-mounted-on-a-monopole-on-the.png': 'lattice',

    // Monopole towers
    'monopole-tower.png': 'monopole',
    'multicarrier-monopole-cell-tower-in-nanuet-new-york-21921952.jpg': 'monopole',
    'xbrand-new-monopole-21431541.jpg.pagespeed.ic.JCcCVzoEAo.jpg': 'monopole',
    'blackjack-01.jpg': 'monopole',
    'crown-castle-multicarrier-cell-tower-monopole-at-exit-22-on-the-hutchinson-river-pkwy-scarsdale-ny-21919036.jpg': 'monopole',
    'fff5683d-5769-4dea-8bd3-aebe181daad4_1920x1080.jpg': 'monopole',
    'ghows-WL-ea96d4c9-4265-4423-bf2f-35cec8cea538-2ae0a9e4.jpg': 'monopole',
    'images-33-_jpg.rf.a2e421b36e790b1c4b5f721b56132f52.jpg': 'monopole',
    'Macro-Tower-17.jpg': 'monopole',
    'Monopole (1).jpg': 'monopole',
    'Monopole.jpg': 'monopole',
    'Steel-Monopole-Communication-Signal-Cell-Tower.jpg': 'monopole',
    'blackjack-01 (1).jpg': 'monopole',
    '67612b51c408c.jpg': 'monopole',
    'Cellular-Tower-3-1024x1024.jpeg': 'monopole',
    'GettyImages-533744279.jpg': 'monopole',
    'Layer-5.jpg': 'monopole',
    'Macro-Tower-15-696x464.jpg': 'monopole',
    '1524237823744.jpeg': 'monopole',
    '1657103877610.jpg': 'monopole',
    '5Gtower_peter_galleghan_alamy.jpg': 'monopole',
    '63f469896088b.jpg': 'monopole',
    '0292_jpg.rf.3b8fbb5b7bdcc4b158c05af98c7256f3.jpg': 'monopole',
    '1-uat5iiwagw2hicwhim7isa.jpg': 'monopole',

    // Water tank towers
    'z9jpxk5u1yfb1.jpg': 'water tank',
    'watertankcellsites-212x300.jpg': 'water tank',
    'watertowercellsitethree.jpg': 'water tank',
    'what-are-these-on-the-water-tower-v0-1qw0k78pucdd1.jpg': 'water tank',
    'ghows-WL-c8eec1e3-4b5d-4285-8724-f4aeffb45fc1-d9d24929.jpg': 'water tank',
    'images (3).jpeg': 'water tank',
    'water tower.jpg': 'water tank',
    'water-tank-cell-phone-towers-600nw-2135933953.jpg': 'water tank',
    'water-tower-with-dish-and-antennas-for-telecommunication-on-a-blue-sky-2H95RNJ.jpg': 'water tank',
    'fbhtsx5h1a271.jpg': 'water tank',
    'a-water-tank-with-cell-phone-antennas-on-top-C3AX2R.jpg': 'water tank',
    'aerial-view-antennas-on-water-600nw-2379928563.jpg': 'water tank',
    'aerial-view-full-size-water-600nw-2342037533.jpg': 'water tank',
    'aerial-view-water-tower-zoom-600nw-2343954775.jpg': 'water tank',
    'Watertower-Kayla-Gray-p-600x900.jpg': 'water tank',
    'a-rural-water-tower-mounted-with-cellular-antennas-CTA1G6.jpg': 'water tank',
    '53e898425a128.jpg': 'water tank',
    '6390534163_8b33f838f7_b.jpg': 'water tank',
    'FletchersPlumbingContractingInc-seotool-43746-WhyWeStill-image1.jpg': 'water tank',
    'Mauston_water_tower_with_cellular_tower_on_top.jpg': 'water tank',
    'VERIZON1.jpg': 'water tank',
    '51122981305_2f3cd361f3_b.jpg': 'water tank',
    '120617_1236_AkronOHMayS1.png': 'water tank'
  };

  return fileToTowerType[fileName] || 'unknown';
};

const MediaUpload: React.FC = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [towerType, setTowerType] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    handleSelectedFile(selectedFile);
  };

  const handleSelectedFile = async (selectedFile: File | undefined) => {
    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
      const type = findTowerType(selectedFile.name);
      setTowerType(type);
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

  return (
    <Container>
      <Header />
      <UploadSection>
        <Title>Tower Classification</Title>
        <p>Upload an image of a tower to identify its type.</p>
        
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
          <ImageContainer>
            <StyledImage 
              src={preview} 
              alt="Uploaded tower" 
            />
            {towerType && (
              <TowerType>
                Tower Type: {towerType}
              </TowerType>
            )}
          </ImageContainer>
        )}
      </UploadSection>
    </Container>
  );
};

export default MediaUpload; 