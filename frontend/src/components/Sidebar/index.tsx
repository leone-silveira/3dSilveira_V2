import React, { useContext, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Tooltip, Typography, useMediaQuery } from '@mui/material';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import { SideBarBox, SidebarButton, ToggleButton, SidebarDivider, Backdrop } from './styles';
import { SystemContext } from '../../context/useSystem';
import { routerList } from '../../configs/routerList';
import { resolvePath } from '../../utils/utils';

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen = false, onCloseMobile }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { system } = useContext(SystemContext);
  const isMobile = useMediaQuery('(max-width: 768px)');

  const currentPage = routerList.find((item) => item.name === system)?.children || [];
  const currentPageFiltered = currentPage.filter((item) => item.path !== '');
  const expanded = isMobile ? true : open;

  const handleNavigate = (path: string) => {
    navigate(path);
    if (isMobile) onCloseMobile?.();
  };

  return (
    <>
      <Backdrop $visible={isMobile && mobileOpen} onClick={onCloseMobile} />
      <SideBarBox isOpened={expanded} $mobileOpen={mobileOpen}>
        <div style={{ flex: 1, width: '100%' }}>
          {currentPageFiltered.map((item) => {
            const fullPath = `/${resolvePath(system, item.path)}`;
            const isActive = location.pathname === fullPath || location.pathname.startsWith(fullPath + '/');

            const btn = (
              <SidebarButton
                key={item.name}
                active={isActive}
                isOpened={expanded}
                onClick={() => handleNavigate(resolvePath(system, item.path))}
              >
                {item.icon && <item.icon />}
                {expanded && (
                  <Typography
                    component="span"
                    sx={{
                      fontSize: '0.85rem',
                      fontWeight: isActive ? 600 : 500,
                      color: 'inherit',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                  </Typography>
                )}
              </SidebarButton>
            );

            if (expanded) {
              return <React.Fragment key={item.name}>{btn}</React.Fragment>;
            }
            return (
              <Tooltip
                key={item.name}
                title={item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                placement="right"
                arrow
              >
                <span style={{ display: 'block' }}>{btn}</span>
              </Tooltip>
            );
          })}
        </div>

        <SidebarDivider />

        <ToggleButton isOpened={open} onClick={() => setOpen(!open)}>
          {open ? (
            <KeyboardDoubleArrowLeftIcon sx={{ fontSize: 18 }} />
          ) : (
            <KeyboardDoubleArrowRightIcon sx={{ fontSize: 18 }} />
          )}
        </ToggleButton>
      </SideBarBox>
    </>
  );
};
