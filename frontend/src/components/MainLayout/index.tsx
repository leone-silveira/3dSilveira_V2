import { Outlet } from 'react-router-dom';
import { Sidebar } from '../Sidebar';
import { Navbar } from '../Navbar';

export const MainLayout: React.FC = () => {
  return (
    <div style={{ width: '100%', height: '100%', margin: 'auto' }}>
      <Navbar/>
        <Sidebar />
      <Outlet />
    </div>
  );
};
