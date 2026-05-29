import { Flex, Box, Text, SimpleGrid } from '@mantine/core';
import { useState } from 'react';
import {  
  IoImages, IoWallet, IoDocumentText, IoCalculator, IoCamera 
} from 'react-icons/io5';
import { RiSettingsFill, RiContactsBook3Fill } from "react-icons/ri";
import { FaMessage, FaPhone } from "react-icons/fa6";


const topApps = [
  { id: 'gallery', name: 'Gallery', icon: IoImages, bg: '#ffffff', color: '#007aff' },
  { id: 'wallet', name: 'Wallet', icon: IoWallet, bg: '#2c2c2c', color: '#ffffff' },
  { id: 'notes', name: 'Notes', icon: IoDocumentText, bg: '#9aec00', color: '#ffffff' },
  { id: 'calculator', name: 'Calculator', icon: IoCalculator, bg: '#ffd001', color: '#ffffff' },
  { id: 'camera', name: 'Camera', icon: IoCamera, bg: '#d3d3d3', color: '#1c1c1e' }
];

const dockApps = [
  { id: 'phone', name: 'Phone', icon: FaPhone, bg: '#34c759', color: '#ffffff' },
  { id: 'messages', name: 'Messages', icon: FaMessage, bg: '#0353ff', color: '#ffffff' },
  { id: 'contacts', name: 'Contacts', icon: RiContactsBook3Fill, bg: '#ffaf01', color: '#ffffff' },
  { id: 'settings', name: 'Settings', icon: RiSettingsFill, bg: '#242424', color: '#ffffff' },
];

export default function HomeApp({ onOpenApp }: { onOpenApp: (appName: string) => void }) {
  
  const AppIcon = ({ app, hideName = false }: { app: any; hideName?: boolean }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <Flex 
        direction="column" 
        align="center" 
        gap={4} 
        onClick={() => onOpenApp(app.name)} 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ cursor: 'pointer', width: '46px' }}
      >
        <Box
          style={{
            width: '46px',
            height: '46px',
            backgroundColor: app.bg,
            borderRadius: '12px',
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            opacity: isHovered ? 0.85 : 1,
            transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)', 
          }}
        >
          <app.icon size={27} color={app.color} />
        </Box>
        {!hideName && (
          <Text 
            size="10.5px" 
            c="white" 
            fw={600} 
            style={{ 
              textShadow: '0 1px 2px rgba(0,0,0,0.6)', 
              whiteSpace: 'nowrap',
              opacity: isHovered ? 0.85 : 1,
              transition: 'opacity 0.2s ease',
            }}
          >
            {app.name}
          </Text>
        )}
      </Flex>
    );
  };

  return (
    <Flex 
      direction="column" 
      style={{ 
        height: '100%', 
        padding: '25px 0px 15px 0px' 
      }} 
      justify="space-between"
    >
      
      <Box px={16}> 
        <SimpleGrid cols={4} spacing={0} verticalSpacing="sm" style={{ justifyItems: 'center' }}>
          {topApps.map(app => (
            <AppIcon key={app.id} app={app} />
          ))}
        </SimpleGrid>
      </Box>

      <Box px={13}> 
        <Box
          style={{
            backgroundColor: '#181818b4', 
            borderRadius: '27px',       
            padding: '12px 0px', 
          }}
        >
          <SimpleGrid cols={4} spacing={0} style={{ justifyItems: 'center' }}>
            {dockApps.map(app => (
              <AppIcon key={app.id} app={app} hideName={true} />
            ))}
          </SimpleGrid>
        </Box>
      </Box>
      
    </Flex>
  );
}