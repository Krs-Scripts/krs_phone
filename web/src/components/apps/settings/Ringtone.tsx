import { useState, useRef, useEffect } from 'react';
import { Box, Flex, Text, ScrollArea } from '@mantine/core';
import { IoChevronBack, IoCheckmarkOutline } from 'react-icons/io5';
import { fetchNui } from '../../../utils/fetchNui'; 

export default function RingtoneApp({ 
  onBack, 
  isDarkMode,
  showNotify 
}: { 
  onBack: () => void, 
  isDarkMode: boolean,
  showNotify: (title: string, msg: string) => void
}) {
  const [selectedRingtone, setSelectedRingtone] = useState('Default');

  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audioPlayerRef.current) audioPlayerRef.current.pause();
    };
  }, []);

  const playOrStopPreview = (label: string, fileName: string) => {
    if (audioPlayerRef.current && !audioPlayerRef.current.paused && selectedRingtone === label) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current.currentTime = 0;
      return;
    }

    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current.currentTime = 0;
    }

    const isGame = (window as any).invokeNative !== undefined || window.location.protocol === 'nui:';
    const audioPath = isGame 
      ? `nui://krs_phone/web/sound/ringtones/${fileName}` 
      : `./sound/ringtones/${fileName}`;

    const newAudio = new Audio(audioPath);
    newAudio.play().catch(e => console.log("Audio error:", e));
    
    audioPlayerRef.current = newAudio;
    setSelectedRingtone(label);
    showNotify('Ringtone', `Ringtone: ${label}`);
    fetchNui('save-settings', { ringtone: label }).catch(e => console.log(e));
  };

  const SoundOption = ({ label, fileName, selected }: { label: string, fileName: string, selected?: boolean }) => {
    const [isHovered, setIsHovered] = useState(false);
    return (
      <Flex 
        align="center" justify="space-between" p="md" mb="xs" 
        onClick={() => playOrStopPreview(label, fileName)}
        onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}
        style={{ 
          backgroundColor: isDarkMode ? '#151515' : '#ffffff', 
          borderRadius: '12px', cursor: 'pointer',
          transform: isHovered ? 'scale(0.99)' : 'scale(1)',
          opacity: isHovered ? (isDarkMode ? 0.85 : 0.7) : 1, 
          transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}
      >
        <Text size="md" fw={500} c={isDarkMode ? "white" : "black"}>{label}</Text>
        {selected && <IoCheckmarkOutline size={22} color="#2f90ff" />}
      </Flex>
    );
  };

  return (
    <Box style={{ flex: 1, backgroundColor: isDarkMode ? '#000' : '#f2f2f7', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      
      <Flex align="center" px="sm" py="md" style={{ position: 'relative' }}>
        <Flex align="center" onClick={onBack} style={{ cursor: 'pointer', zIndex: 2, gap: '2px' }}>
          <IoChevronBack size={22} color="#2f90ff" />
          <Text c="#2f90ff" size="sm" mt={1}>Settings</Text>
        </Flex>
        <Text fw={600} c={isDarkMode ? "white" : "black"} style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', zIndex: 1 }}>
          Ringtone
        </Text>
      </Flex>

      <ScrollArea 
        style={{ 
          flex: 1, width: '100%',
          maskImage: `linear-gradient(to bottom, transparent 0%, ${isDarkMode ? 'black' : 'white'} 3%, ${isDarkMode ? 'black' : 'white'} 90%, transparent 100%)`,
          WebkitMaskImage: `linear-gradient(to bottom, transparent 0%, ${isDarkMode ? 'black' : 'white'} 3%, ${isDarkMode ? 'black' : 'white'} 90%, transparent 100%)`
        }}
        scrollbarSize={0} offsetScrollbars
      >
        <Box px={16} pb={60} mt="md">
          <SoundOption label="Default" fileName="default.mp3" selected={selectedRingtone === 'Default'} />
          <SoundOption label="Apex" fileName="apex.mp3" selected={selectedRingtone === 'Apex'} />
          <SoundOption label="Harp" fileName="harp.mp3" selected={selectedRingtone === 'Harp'} />
          <SoundOption label="Radar" fileName="radar.mp3" selected={selectedRingtone === 'Radar'} />
          <SoundOption label="Sencha" fileName="sencha.mp3" selected={selectedRingtone === 'Sencha'} />
          <SoundOption label="Silk" fileName="silk.mp3" selected={selectedRingtone === 'Silk'} />
          <SoundOption label="Summit" fileName="summit.mp3" selected={selectedRingtone === 'Summit'} />
        </Box>
      </ScrollArea>
    </Box>
  );
}