import { useState, useEffect } from 'react';
import Frame from './components/Frame';
import { useNuiEvent } from './hooks/useNuiEvent';
import { Box } from '@mantine/core';
import { fetchNui } from './utils/fetchNui';

const App = () => {
  const [visible, setVisible] = useState(false);

  useNuiEvent<boolean>('setVisible', setVisible);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && visible) {
        fetchNui('hide-ui').catch(err => console.log("Closing error:", err));
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [visible]);

  return (
    <Box
      style={{
        position: 'absolute',
        bottom: '30px',
        right: '30px',
        zIndex: 1000,
        display: visible ? 'block' : 'none', 
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.2s ease', 
      }}
    >
      <Frame />
    </Box>
  );
};

export default App;