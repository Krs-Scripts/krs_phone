import { useState, useRef, useEffect } from 'react';
import { Box, Flex, Text } from '@mantine/core';
import { IoChevronBack } from 'react-icons/io5';
import HomeApp from './HomeApp';
import StatusBar from './StatusBar';
import SettingsApp from './apps/settings/Settings'; 
import Notify from './Notify'; 
import LockScreen from './LockScreen'; 
import StartPhone from './StartPhone';
import { useNuiEvent } from '../hooks/useNuiEvent';
import { fetchNui } from '../utils/fetchNui'; 

export default function Home() {
  const [activeApp, setActiveApp] = useState<string | null>(null);
  const [barHovered, setBarHovered] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isFlightMode, setIsFlightMode] = useState(false);
  const [isLocked, setIsLocked] = useState(true); 
  const [isBooting, setIsBooting] = useState(false); 
  const [notify, setNotify] = useState({ show: false, title: '', message: '' });
  const [myNumber, setMyNumber] = useState<string | null>(null);
  const [playerName, setPlayerName] = useState<string | null>(null); 
  
  const notifyTimeoutRef = useRef<number | null>(null);
  const isGame = (window as any).invokeNative !== undefined || window.location.protocol === 'nui:';
  const defaultWallpaper = isGame ? "nui://krs_phone/web/images/wallpaper/default.png" : "/images/wallpaper/default.png";
  const [wallpaperPath, setWallpaperPath] = useState(defaultWallpaper);

  useEffect(() => {
    setBarHovered(false);
  }, [activeApp]);

  useNuiEvent('setVisible', (visible: boolean) => {
    if (!visible) {
      setIsLocked(true);
      setActiveApp(null); 
    }
  });

  useNuiEvent('setPhoneData', (data: any) => {
    if (data && data.playerName) {
      setPlayerName(data.playerName);
    }
  });

  useNuiEvent('setMyNumber', (number: string) => {
    setMyNumber(number);
  });

  useNuiEvent('setSettings', (data: any) => {
    if (data) {
      if (data.darkmode !== undefined) {
        setIsDarkMode(data.darkmode);
      }
      if (data.flightmode !== undefined) {
        setIsFlightMode(data.flightmode);
      }
      if (data.hasBooted === false) {
        setIsBooting(true);
      } else {
        setIsBooting(false); 
      }
    }
  });

  useNuiEvent('setWallpaper', (url: string) => {
    handleWallpaperChange(url);
  });

  const handleWallpaperChange = (url: string) => {
    if (url && url.trim() !== "") {
      setWallpaperPath(url);
    } else {
      setWallpaperPath(defaultWallpaper);
    }
  };

  const showNotify = (title: string, message: string) => {
    setNotify({ show: true, title, message });
    if (notifyTimeoutRef.current) clearTimeout(notifyTimeoutRef.current);
    notifyTimeoutRef.current = setTimeout(() => {
      setNotify((prev) => ({ ...prev, show: false }));
    }, 2500); 
  };

  const homeBackground = `url("${wallpaperPath}") center/cover no-repeat`;

  const renderActiveApp = () => {
    switch (activeApp) {
      case 'Settings':
        return (
          <SettingsApp 
            isDarkMode={isDarkMode} 
            setIsDarkMode={setIsDarkMode} 
            isFlightMode={isFlightMode} 
            setIsFlightMode={setIsFlightMode} 
            showNotify={showNotify} 
            phoneNumber={myNumber}
            playerName={playerName} 
            onWallpaperChange={handleWallpaperChange} 
            onFormatPhone={() => {
              setIsDarkMode(true);
              setIsFlightMode(false);
              setWallpaperPath(defaultWallpaper);
              
              fetchNui('save-settings', { 
                hasBooted: false,
                darkmode: true,
                flightmode: false,
                ringtone: 'Default',
                volume: 0.6,
                brightness: 1.0
              }).catch(console.error);
              
              fetchNui('set-wallpaper', { url: "" }).catch(console.error);

              setActiveApp(null);
              setIsBooting(true);
            }}
          />
        );
      
      case 'Phone':

      default:
        return (
          <Box p="xl" style={{ flex: 1, backgroundColor: isDarkMode ? '#000000' : '#f2f2f7' }}>
            <Text ta="center" mt="xl" c={isDarkMode ? "dimmed" : "gray"}>
              The application {activeApp} is under development...
            </Text>
          </Box>
        );
    }
  };

  return (
    <Box
      style={{
        flex: 1,
        background: activeApp && !isLocked ? (isDarkMode ? '#000000' : '#f2f2f7') : homeBackground, 
        position: 'relative', display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 
      }}
    >

      {isBooting && (
        <StartPhone 
          isDarkMode={isDarkMode} 
          onComplete={() => {
            setIsBooting(false);
            fetchNui('save-settings', { hasBooted: true }).catch(console.error);
          }} 
        />
      )}

      {!isBooting && (
        <>
          <Box style={{ zIndex: 1000, position: 'relative' }}>
            <StatusBar darkTheme={activeApp !== null && !isDarkMode && !isLocked} isFlightMode={isFlightMode} showTime={!isLocked} />
          </Box>

          <Notify visible={notify.show} title={notify.title} message={notify.message} isDarkMode={isDarkMode} />

          {isLocked ? (
            <LockScreen onUnlock={() => setIsLocked(false)} wallpaperPath={wallpaperPath} />
          ) : (
            <>
              {activeApp ? (
                <Box style={{ flex: 1, display: 'flex', flexDirection: 'column', paddingTop: '45px', minHeight: 0, position: 'relative' }}>
                  
                  {activeApp !== 'Settings' && (
                    <Flex align="center" px="sm" py="md" bg={isDarkMode ? '#000' : '#f2f2f7'} style={{ zIndex: 10, position: 'relative' }}>
                      <Flex align="center" onClick={() => setActiveApp(null)} style={{ cursor: 'pointer', zIndex: 2, gap: '2px' }}>
                        <IoChevronBack size={22} color="#2f90ff" />
                        <Text c="#2f90ff" size="sm" mt={1}>Back</Text>
                      </Flex>
                      <Text fw={600} c={isDarkMode ? "#fff" : "#000"} style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', zIndex: 1 }}>
                        {activeApp}
                      </Text>
                    </Flex>
                  )}

                  <Box style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                    {renderActiveApp()}
                  </Box>

                  <Box 
                    onMouseEnter={() => setBarHovered(true)} 
                    onMouseLeave={() => setBarHovered(false)}
                    onClick={() => setActiveApp(null)} 
                    style={{
                      position: 'absolute', bottom: 0, left: 0, width: '100%', height: '35px', 
                      display: 'flex', justifyContent: 'center', alignItems: 'flex-end',
                      paddingBottom: '8px', cursor: 'pointer', zIndex: 99 
                    }}
                  >
                    <Box 
                      style={{
                        width: '100px', height: '5px',
                        backgroundColor: isDarkMode ? '#ffffff' : '#000000',
                        borderRadius: '10px', 
                        opacity: barHovered ? 1 : 0, 
                        transition: 'opacity 0.2s ease-in-out'
                      }}
                    />
                  </Box>

                </Box>
              ) : (
                <Box style={{ flex: 1, paddingTop: '50px' }}>
                  <HomeApp onOpenApp={setActiveApp} />
                </Box>
              )}
            </>
          )}
        </>
      )}
    </Box>
  );
}