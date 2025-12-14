import { Outlet } from 'react-router-dom';
import { Sidebar } from '../Sidebar';
import { Navbar } from '../Navbar';

export const MainLayout: React.FC = () => {
  return (
    <div style={{ width: '100%', height: '100%', margin: 'auto' }}>
      <Navbar
        right={
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ fontSize: 13, color: "#1951acff" }}>User</span>
          </div>
        }
      />
        <Sidebar />
      <Outlet />
    </div>
  );
};
