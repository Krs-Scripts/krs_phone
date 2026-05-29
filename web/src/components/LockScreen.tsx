import { useState, useEffect } from 'react';
import { Box, Flex, Text, ActionIcon } from '@mantine/core';
import { IoIosFlashlight } from "react-icons/io";
import { BsCameraFill } from "react-icons/bs";

interface LockScreenProps {
  onUnlock: () => void;
  wallpaperPath: string;
}

export default function LockScreen({ onUnlock, wallpaperPath }: LockScreenProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = time.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
  const formattedDate = time.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' });

  return (
    <Box
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 999, 
        background: `url("${wallpaperPath}") center/cover no-repeat`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '65px',
        paddingBottom: '10px', 
      }}
    >
      <style>{`
        @keyframes pulseText {
          0% { opacity: 0.5; transform: translateY(0); }
          50% { opacity: 1; transform: translateY(-3px); }
          100% { opacity: 0.5; transform: translateY(0); }
        }
      `}</style>

      <Flex direction="column" align="center" style={{ textShadow: '0px 2px 10px rgba(0,0,0,0.3)' }}>
        <Text c="white" size="lg" fw={500} style={{ textTransform: 'capitalize' }}>
          {formattedDate}
        </Text>
        <Text c="white" style={{ fontSize: '80px', fontWeight: 200, lineHeight: 1, letterSpacing: '-2px' }}>
          {formattedTime}
        </Text>
      </Flex>

      <Box style={{ width: '100%', paddingBottom: '15px' }}> 
        
        <Flex justify="space-between" px={45} mb={15}> 
          <ActionIcon
            size={50}
            radius="xl"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.35)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
            }}
          >
            <IoIosFlashlight size={24} color="white" />
          </ActionIcon>
          
          <ActionIcon
            size={50}
            radius="xl"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.35)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
            }}
          >
            <BsCameraFill size={20} color="white" />
          </ActionIcon>
        </Flex>

        <Text
          c="white"
          size="12px" 
          fw={500}
          ta="center"
          onClick={onUnlock}
          style={{
            cursor: 'pointer',
            textShadow: '0px 1px 4px rgba(0,0,0,0.8)',
            animation: 'pulseText 2.5s infinite ease-in-out',
            letterSpacing: '0.2px'
          }}
        >
          Swipe up to unlock
        </Text>
      </Box>
    </Box>
  );
}