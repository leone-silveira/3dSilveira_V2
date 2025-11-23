import { Outlet } from 'react-router-dom';
import { Sidebar } from '../Sidebar';

export const MainLayout = () => {
  return (
    <div style={{ width: '100%', height: '100%', margin: 'auto' }}>
      <Sidebar />
      <Outlet />
    </div>
  );
};
