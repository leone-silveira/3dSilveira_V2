import { Outlet } from 'react-router-dom';
import { Sidebar } from '../Sidebar';
import { Navbar } from '../Navbar';
import { Box } from '@mui/material';

export const MainLayout: React.FC = () => {
  return (
    <Box sx={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#121212' }}>
      <Navbar />
      <Box sx={{ display: 'flex', flex: 1 }}>
        <Sidebar />
        <Box
          sx={{
            marginLeft: '80px',
            padding: '30px',
            flex: 1,
            width: 'calc(100% - 80px)',
            overflow: 'auto',
            transition: 'margin-left 0.3s ease-in-out',
            '@media (max-width: 600px)': {
              marginLeft: '0',
              padding: '20px',
            },
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};
