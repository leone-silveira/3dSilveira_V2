import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import { Sidebar } from '../../components/sidebar';

export const MainLayout = () => {
  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
        <Outlet />
      </Box>
    </Box>
  );
};
