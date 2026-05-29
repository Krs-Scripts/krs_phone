import { useState } from 'react';
import { Box, Flex, Text, ScrollArea, ActionIcon } from '@mantine/core';
import { IoCall, IoWater, IoMusicalNotes, IoMoon, IoAirplane, IoClose, IoCopyOutline, IoCheckmarkOutline, IoChevronForward } from 'react-icons/io5';
import { RiResetLeftLine } from "react-icons/ri";
import WallpaperApp from './Wallpaper';
import RingtoneApp from './Ringtone';
import { fetchNui } from '../../../utils/fetchNui'; 

const CustomCheckbox = ({ checked, isDarkMode }: { checked?: boolean, isDarkMode: boolean }) => (
  <Flex justify="center" align="center" style={{ width: '20px', height: '20px', border: `1.5px solid ${isDarkMode ? '#a1a1aa' : '#c7c7cc'}`, borderRadius: '4px', backgroundColor: 'transparent', transition: 'all 0.2s ease' }}>
    {checked && <IoClose size={16} color={isDarkMode ? '#a1a1aa' : '#8e8e93'} />}
  </Flex>
);

const SettingsItem = ({ icon, label, subLabel, rightElement, isDarkMode, onClick }: any) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <Flex align="center" justify="space-between" px="md" py="sm" mb="xs" onClick={onClick} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}
      style={{ 
        backgroundColor: isDarkMode ? '#151515' : '#ffffff', borderRadius: '12px', cursor: 'pointer', minHeight: '54px',
        transform: isHovered ? 'scale(0.99)' : 'scale(1)', opacity: isHovered ? (isDarkMode ? 0.85 : 0.7) : 1, transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
      }}
    >
      <Flex align="center" gap="md">
        {icon}
        <Flex direction="column" justify="center" style={{ gap: '3px' }}>
          <Text size={subLabel ? "sm" : "md"} fw={500} c={isDarkMode ? '#ffffff' : '#000000'} lh={1}>{label}</Text>
          {subLabel && <Text size="11px" fw={500} c={isDarkMode ? '#a1a1aa' : '#8e8e93'} lh={1}>{subLabel}</Text>}
        </Flex>
      </Flex>
      {rightElement && <Box>{rightElement}</Box>}
    </Flex>
  );
};

const SectionTitle = ({ title, isDarkMode }: { title: string, isDarkMode: boolean }) => (
  <Text size="sm" fw={700} c={isDarkMode ? "#e4e4e7" : "#6b6b70"} mt="md" mb="xs" ml="xs">{title}</Text>
);

export default function SettingsApp({ isDarkMode, setIsDarkMode, isFlightMode, setIsFlightMode, showNotify, phoneNumber, onFormatPhone, playerName, onWallpaperChange }: any) {
  const iconColor = "#228be6"; 
  const [activeView, setActiveView] = useState<'main' | 'wallpaper' | 'ringtone'>('main');
  const [isCopied, setIsCopied] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  const isGame = (window as any).invokeNative !== undefined || window.location.protocol === 'nui:';
  const avatarSrc = isGame 
    ? "nui://krs_phone/web/images/avatar.png" 
    : "./images/avatar.png";

  const handleCopyNumber = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    const textToCopy = phoneNumber || "Unknown";
    
    const textArea = document.createElement("textarea");
    textArea.value = textToCopy;
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      setIsCopied(true);
      showNotify('Phone', 'Number copied to clipboard');
      setTimeout(() => setIsCopied(false), 2000); 
    } catch (err) {
      console.error("Error while copying:", err);
    }
    
    document.body.removeChild(textArea);
  };

  if (activeView === 'wallpaper') return <WallpaperApp onBack={() => setActiveView('main')} isDarkMode={isDarkMode} showNotify={showNotify} onWallpaperChange={onWallpaperChange} />;
  if (activeView === 'ringtone') return <RingtoneApp onBack={() => setActiveView('main')} isDarkMode={isDarkMode} showNotify={showNotify} />;

  return (
    <Box style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, backgroundColor: isDarkMode ? '#000000' : '#f2f2f7', position: 'relative' }}>
      
      {showResetModal && (
        <Box 
          style={{ 
            position: 'absolute', top: '-45px', left: 0, right: 0, bottom: 0, 
            backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 9999, 
            display: 'flex', alignItems: 'center', justifyContent: 'center' 
          }}
        >
          <Box 
            style={{ 
              width: '80%', backgroundColor: isDarkMode ? '#1c1c1ee8' : '#ffffffea', 
              borderRadius: '14px', overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
            }}
          >
            <Box p="md" style={{ textAlign: 'center', borderBottom: `1px solid ${isDarkMode ? '#38383a' : '#e5e5ea'}` }}>
              <Text fw={600} size="md" c={isDarkMode ? '#ffffff' : '#000000'}>Reset Phone</Text>
              <Text size="sm" mt={6} c={isDarkMode ? '#a1a1aa' : '#8e8e93'}>
                Are you sure you want to format the phone?
              </Text>
            </Box>
            <Flex>
              <Box 
                onClick={() => setShowResetModal(false)}
                style={{ flex: 1, padding: '12px', textAlign: 'center', cursor: 'pointer', borderRight: `1px solid ${isDarkMode ? '#38383a' : '#e5e5ea'}` }}
              >
                <Text c="#0a84ff" fw={400}>Cancel</Text>
              </Box>
              <Box 
                onClick={() => {
                  setShowResetModal(false);
                  if(onFormatPhone) onFormatPhone();
                }}
                style={{ flex: 1, padding: '12px', textAlign: 'center', cursor: 'pointer' }}
              >
                <Text c="#ff3b30" fw={600}>Confirm</Text>
              </Box>
            </Flex>
          </Box>
        </Box>
      )}

      <Box px={16} pt={15} pb={5}><Text size="32px" fw={700} c={isDarkMode ? "white" : "black"}>Settings</Text></Box>
      
      <ScrollArea style={{ flex: 1, width: '100%', maskImage: `linear-gradient(to bottom, transparent 0%, ${isDarkMode ? 'black' : 'white'} 3%, ${isDarkMode ? 'black' : 'white'} 90%, transparent 100%)`, WebkitMaskImage: `linear-gradient(to bottom, transparent 0%, ${isDarkMode ? 'black' : 'white'} 3%, ${isDarkMode ? 'black' : 'white'} 90%, transparent 100%)` }} scrollbarSize={0} offsetScrollbars>
        
        <Box px={16} pt={12} pb={60}>
          
          <Flex 
            align="center" 
            justify="space-between"
            px="md" 
            py="sm" 
            mb="sm"  
            style={{ 
              backgroundColor: isDarkMode ? '#151515' : '#ffffff', 
              borderRadius: '12px', 
              cursor: 'pointer',
              minHeight: '75px'
            }}
          >
            <Flex align="center" gap="md">
              <Box 
                style={{ 
                  width: '56px', height: '56px', borderRadius: '50%', 
                  overflow: 'hidden', flexShrink: 0,
                  backgroundColor: isDarkMode ? '#2c2c2e' : '#e5e5ea' 
                }}
              >
                <img 
                  src={avatarSrc} 
                  alt="Profile" 
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = "./images/avatar.png"; }}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              </Box>
              <Flex direction="column" justify="center" style={{ gap: '2px' }}>
                <Text size="17px" fw={500} c={isDarkMode ? '#ffffff' : '#000000'} lh={1.2}>
                  {playerName || "Unknown Player"}
                </Text>
                <Text size="12px" fw={400} c={isDarkMode ? '#a1a1aa' : '#8e8e93'} mt={2}>
                  Krs ID, iFruit OS
                </Text>
              </Flex>
            </Flex>
            <IoChevronForward size={18} color={isDarkMode ? "#5c5c5e" : "#c7c7cc"} />
          </Flex>

          <SectionTitle title="General" isDarkMode={isDarkMode} />
          
          <SettingsItem 
            icon={<RiResetLeftLine size={22} color={iconColor} />} 
            label="Reset" 
            isDarkMode={isDarkMode} 
            onClick={() => setShowResetModal(true)} 
          />
          
          <SettingsItem 
            icon={<IoCall size={22} color={iconColor} />} 
            label="Phone number" 
            subLabel={phoneNumber || 'Loading...'} 
            isDarkMode={isDarkMode} 
            rightElement={<ActionIcon variant="transparent" onClick={handleCopyNumber}>{isCopied ? <IoCheckmarkOutline size={22} color="#228be6" /> : <IoCopyOutline size={20} color={isDarkMode ? "#a1a1aa" : "#8e8e93"} />}</ActionIcon>} 
          />

          <SectionTitle title="Customisation" isDarkMode={isDarkMode} />
          <SettingsItem icon={<IoWater size={22} color={iconColor} />} label="Wallpaper" onClick={() => setActiveView('wallpaper')} isDarkMode={isDarkMode} />
          <SettingsItem icon={<IoMusicalNotes size={22} color={iconColor} />} label="Ringtone" onClick={() => setActiveView('ringtone')} isDarkMode={isDarkMode} />
          
          <SettingsItem 
            icon={<IoMoon size={22} color={iconColor} />} label="Darkmode" isDarkMode={isDarkMode}
            rightElement={<CustomCheckbox checked={isDarkMode} isDarkMode={isDarkMode} />}
            onClick={() => {
              const newMode = !isDarkMode;
              setIsDarkMode(newMode);
              fetchNui('save-settings', { darkmode: newMode }).catch(e => console.log(e));
              showNotify('Display', `Darkmode is now ${newMode ? 'ON' : 'OFF'}`);
            }}
          />

          <SectionTitle title="Call" isDarkMode={isDarkMode} />
          <SettingsItem 
            icon={<IoAirplane size={22} color={iconColor} />} label="Flightmode" isDarkMode={isDarkMode}
            rightElement={<CustomCheckbox checked={isFlightMode} isDarkMode={isDarkMode} />} 
            onClick={() => {
              const newMode = !isFlightMode;
              setIsFlightMode(newMode);
              fetchNui('save-settings', { flightmode: newMode }).catch(e => console.log(e));
              showNotify('Network', `Flightmode is now ${newMode ? 'ON' : 'OFF'}`);
            }}
          />
        </Box>
      </ScrollArea>
    </Box>
  );
}