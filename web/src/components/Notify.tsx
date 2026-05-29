import { useEffect } from 'react';
import { Box, Flex, Text, Transition } from '@mantine/core';
import { IoNotifications } from 'react-icons/io5';

interface NotifyProps {
  visible: boolean;
  title: string;
  message: string;
  isDarkMode: boolean;
}

export default function Notify({ visible, title, message, isDarkMode }: NotifyProps) {

  useEffect(() => {
    if (visible) {
      const isGame = (window as any).invokeNative !== undefined || window.location.protocol === 'nui:';
      const audioPath = isGame 
        ? "nui://krs_phone/web/sound/notify/notify.mp3" 
        : "./sound/notify/notify.mp3";
      
      const audio = new Audio(audioPath);
      audio.volume = 0.5; 
      audio.play().catch(e => console.log("Errore riproduzione notifica:", e));
    }
  }, [visible]);

  return (
    <Transition mounted={visible} transition="slide-down" duration={300} timingFunction="ease">
      {(styles) => (
        <Box
          style={{
            ...styles,
            position: 'absolute',
            top: '40px', 
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 9999, 
            width: '90%', 
          }}
        >
          <Flex
            align="center"
            gap="sm"
            p="sm"
            style={{
              backgroundColor: isDarkMode ? 'rgba(30, 30, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)',
              border: 'none',
              borderRadius: '20px',
              boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3)',
            }}
          >
            <Box
              style={{
                backgroundColor: '#2f90ff',
                borderRadius: '10px',
                padding: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <IoNotifications size={18} color="#fff" />
            </Box>

            <Flex direction="column">
              <Text size="sm" fw={600} c={isDarkMode ? '#fff' : '#000'} lh={1.1}>
                {title}
              </Text>
              <Text size="xs" fw={500} c={isDarkMode ? '#a1a1aa' : '#6b6b70'} lh={1.2}>
                {message}
              </Text>
            </Flex>
          </Flex>
        </Box>
      )}
    </Transition>
  );
}