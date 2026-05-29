import { useState, useEffect } from 'react';
import { Box, Flex } from '@mantine/core';

interface StartPhoneProps {
  onComplete: () => void;
  isDarkMode?: boolean;
}

export default function StartPhone({ onComplete, isDarkMode = true }: StartPhoneProps) {
  const [progress, setProgress] = useState(0);
  const isGame = (window as any).invokeNative !== undefined || window.location.protocol === 'nui:';
  const logoSrc = isGame 
    ? "nui://krs_phone/web/images/start/logo.png" 
    : "./images/start/logo.png";

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onComplete();
          }, 500); 
          return 100;
        }
        return prev + Math.floor(Math.random() * 15) + 5; 
      });
    }, 250);

    return () => clearInterval(interval);
  }, [onComplete]);

  const totalDots = 5; 
  const activeDots = Math.floor((progress / 100) * totalDots);

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: isDarkMode ? '#000000' : '#ffffff',
        position: 'absolute', 
        top: 0,
        left: 0,
        zIndex: 9999, 
      }}
    >

      <Box mb={15} style={{ display: 'flex', justifyContent: 'center' }}>
        <img 
          src={logoSrc} 
          alt="KRS Phone Logo" 
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = "./images/start/logo.png";
          }}
          style={{ 
            width: '240px', 
            height: 'auto',
            objectFit: 'contain'
          }} 
        />
      </Box>

      <Flex gap="md">
        {Array.from({ length: totalDots }).map((_, index) => {
          const isActive = index < activeDots || progress >= 100;
          
          return (
            <Box
              key={index}
              style={{
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                backgroundColor: isActive 
                  ? (isDarkMode ? '#ffffff' : '#000000') 
                  : (isDarkMode ? '#333333' : '#e0e0e0'), 
                transition: 'all 0.3s ease-in-out',
                boxShadow: isActive ? `0 0 10px ${isDarkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)'}` : 'none',
                transform: isActive ? 'scale(1.1)' : 'scale(1)'
              }}
            />
          );
        })}
      </Flex>
    </Flex>
  );
}