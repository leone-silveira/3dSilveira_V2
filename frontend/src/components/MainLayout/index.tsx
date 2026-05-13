import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '../Sidebar';
import { Navbar } from '../Navbar';
import { Box } from '@mui/material';
import { useEffect } from 'react';

export const MainLayout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#0d0d0d' }}>
      <Navbar onMobileMenuClick={() => setMobileOpen((v) => !v)} mobileOpen={mobileOpen} />
      <Box sx={{ display: 'flex', flex: 1, position: 'relative' }}>
        <Sidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />
        <Box
          component="main"
          sx={{
            marginLeft: '64px',
            padding: '28px 32px',
            flex: 1,
            minWidth: 0,
            maxWidth: '100%',
            overflowX: 'hidden',
            transition: 'margin-left 0.25s ease',
            '@media (max-width: 768px)': {
              marginLeft: 0,
              padding: '16px 14px',
            },
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};
