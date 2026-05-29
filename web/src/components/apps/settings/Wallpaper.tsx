import { useState } from 'react';
import { Box, Flex, Text, TextInput, Button } from '@mantine/core';
import { IoChevronBack } from 'react-icons/io5';
import { fetchNui } from '../../../utils/fetchNui'; 

export default function WallpaperApp({ 
  onBack, 
  isDarkMode, 
  showNotify,
  onWallpaperChange 
}: { 
  onBack: () => void, 
  isDarkMode: boolean,
  showNotify: (title: string, msg: string) => void,
  onWallpaperChange: (url: string) => void 
}) {
  const [url, setUrl] = useState('');

  const handleSave = () => {
    fetchNui('set-wallpaper', { url: url }).catch(e => console.log(e));
    onWallpaperChange(url);
    showNotify('Wallpaper', 'New background applied successfully');
    onBack(); 
  };

  return (
    <Box style={{ flex: 1, backgroundColor: isDarkMode ? '#000' : '#f2f2f7', display: 'flex', flexDirection: 'column' }}>
      
      <Flex align="center" px="sm" py="md" style={{ position: 'relative' }}>
        <Flex align="center" onClick={onBack} style={{ cursor: 'pointer', zIndex: 2, gap: '2px' }}>
          <IoChevronBack size={22} color="#2f90ff" />
          <Text c="#2f90ff" size="sm" mt={1}>Settings</Text>
        </Flex>
        <Text fw={600} c={isDarkMode ? "white" : "black"} style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', zIndex: 1 }}>
          Wallpaper
        </Text>
      </Flex>

      <Box p="md" mt="md">
        <Text size="xs" fw={700} c={isDarkMode ? "#a1a1aa" : "#6b6b70"} mb="xs" ml="xs" tt="uppercase">
          Custom Wallpaper Link (.png / .jpg)
        </Text>
        <TextInput 
          placeholder="https://..."
          value={url}
          onChange={(e) => setUrl(e.currentTarget.value)}
          styles={{
            input: {
              backgroundColor: isDarkMode ? '#151515' : '#ffffff',
              border: 'none',
              color: isDarkMode ? '#fff' : '#000',
              height: '50px',
              borderRadius: '12px'
            }
          }}
        />

        <Button 
          fullWidth mt="xl" radius={12} color="#2f90ff" size="md" onClick={handleSave}
        >
          Apply Wallpaper
        </Button>
      </Box>
    </Box>
  );
}