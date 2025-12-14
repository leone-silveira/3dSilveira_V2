import { Box, Button, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface SidebarLabelList {
  label: string;
  path: string;
  icon: React.ReactNode;
}


export const Sidebar: React.FC = () => {
  const sidebarList: SidebarLabelList[] = [
    { label: 'Profile', path: '/profile', icon: "@" },
    { label: 'Settings', path: '/settings', icon: "⚙️" },
    { label: 'Logout', path: '/logout' , icon: "🚪" },
  ];
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };
const DrawerList = (
    <Box sx={{ width: 200 }} onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
      <List>
        {['Home', 'Health', 'Finances'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>    
                {index % 2 === 0 ?  "->" : "<-"}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {sidebarList.map( sidebarItem => (
          <span onClick={() => {navigate(sidebarItem.path)}}><ListItem key={sidebarItem.label} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {sidebarItem.icon}
              </ListItemIcon>
              <ListItemText primary={sidebarItem.label} />
            </ListItemButton>
          </ListItem> </span>
        ))}
      </List>
    </Box>
  );

  return (
    <div>
      <Button onClick={toggleDrawer(true)}>Open drawer</Button>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </div>
  );
}
