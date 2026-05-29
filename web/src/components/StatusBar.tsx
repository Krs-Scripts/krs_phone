import { useState, useEffect } from 'react';
import { Flex, Text } from '@mantine/core';
import { IoBatteryFull, IoWifi, IoCellular, IoAirplane } from 'react-icons/io5';

interface StatusBarProps {
  darkTheme?: boolean;
  isFlightMode?: boolean; 
  showTime?: boolean; 
}

export default function StatusBar({ 
  darkTheme = false, 
  isFlightMode = false, 
  showTime = true 
}: StatusBarProps) {
  const color = darkTheme ? '#000' : '#fff';

  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = time.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });

  return (
    <Flex
      justify="space-between"
      align="center"
      px={20}
      pt={12}
      pb={4}
      style={{
        position: 'absolute',
        top: 0,
        width: '100%',
        zIndex: 5,
        color: color,
      }}
    >
      <Text size="xs" fw={700} style={{ marginLeft: '5px', opacity: showTime ? 1 : 0 }}>
        {formattedTime}
      </Text>

      <Flex gap={5} align="center" style={{ marginRight: '5px' }}>

        {isFlightMode ? (
          <IoAirplane size={16} />
        ) : (
          <Flex gap={5} align="center">
            <IoCellular size={14} />
            <IoWifi size={14} />
          </Flex>
        )}
        
        <IoBatteryFull size={18} />
      </Flex>
    </Flex>
  );
}