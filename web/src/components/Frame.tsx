import { Box } from '@mantine/core';
import Home from './Home';

export default function Frame() {
  const baseWidth = 320;
  const baseHeight = 660;

  const isGame = (window as any).invokeNative !== undefined || window.location.protocol === 'nui:';
  
  const frameSrc = isGame 
    ? "nui://krs_phone/web/images/frame-iphone.png" 
    : "./images/frame-iphone.png";

  return (
    <Box
      style={{
        width: baseWidth,
        height: baseHeight,
        position: 'relative',
        userSelect: 'none',
      }}
    >
      <Box
        style={{
          position: 'absolute',
          top: '14px',    
          left: '15px',   
          right: '15px',  
          bottom: '14px', 
          backgroundColor: '#000',
          borderRadius: '42px', 
          overflow: 'hidden',   
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Home />
      </Box>

      <img
        src={frameSrc}
        alt="iPhone Frame"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = "./images/frame-iphone.png";
        }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          pointerEvents: 'none', 
          zIndex: 10,
        }}
      />
    </Box>
  );
}