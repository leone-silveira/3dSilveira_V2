import { Box } from '@mui/material';
import styled from 'styled-components';

interface SideBarBoxProps {
  isOpened?: boolean;
  $mobileOpen?: boolean;
}

export const SideBarBox = styled(Box)<SideBarBoxProps>`
  background: #0d0d0d;
  width: ${props => props.isOpened ? '220px' : '64px'};
  display: flex;
  height: calc(100vh - 64px);
  margin-top: 64px;
  align-items: flex-start;
  padding: 12px 0;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  border-right: 1px solid rgba(255, 255, 255, 0.06);
  color: #f0f0f0;
  z-index: 999;
  transition: width 0.25s cubic-bezier(0.4, 0, 0.2, 1), transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  overflow-y: auto;
  overflow-x: hidden;

  @media (max-width: 768px) {
    width: 240px;
    transform: ${props => props.$mobileOpen ? 'translateX(0)' : 'translateX(-100%)'};
    box-shadow: ${props => props.$mobileOpen ? '4px 0 24px rgba(0,0,0,0.5)' : 'none'};
  }

  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 2px; }
`;

export const Backdrop = styled.div<{ $visible?: boolean }>`
  display: none;

  @media (max-width: 768px) {
    display: ${props => props.$visible ? 'block' : 'none'};
    position: fixed;
    top: 64px;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(2px);
    z-index: 998;
  }
`;

export const SidebarButton = styled.button<{ active?: boolean; isOpened?: boolean }>`
  width: calc(100% - 16px);
  margin: 1px 8px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: ${props => props.isOpened ? '10px 12px' : '10px'};
  justify-content: ${props => props.isOpened ? 'flex-start' : 'center'};
  background: ${props => props.active ? 'rgba(102,187,106,0.14)' : 'transparent'};
  color: ${props => props.active ? '#66bb6a' : '#616161'};
  border: ${props => props.active ? '1px solid rgba(102,187,106,0.2)' : '1px solid transparent'};
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
  font-size: 0.85rem;
  font-weight: ${props => props.active ? '600' : '500'};
  white-space: nowrap;
  overflow: hidden;

  &:hover {
    background: rgba(102, 187, 106, 0.1);
    color: #81c784;
    border-color: rgba(102, 187, 106, 0.15);
  }

  svg {
    min-width: 20px;
    font-size: 20px !important;
    flex-shrink: 0;
  }

  @media (max-width: 768px) {
    justify-content: flex-start;
    padding: 12px 14px;
  }
`;

export const ToggleButton = styled.button<{ isOpened?: boolean }>`
  width: calc(100% - 16px);
  margin: 2px 8px;
  display: flex;
  align-items: center;
  justify-content: ${props => props.isOpened ? 'flex-end' : 'center'};
  padding: 9px 12px;
  background: transparent;
  color: #424242;
  border: 1px solid transparent;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.04);
    color: #9e9e9e;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

export const SidebarDivider = styled.div`
  width: calc(100% - 24px);
  margin: 8px 12px;
  height: 1px;
  background: rgba(255, 255, 255, 0.06);
`;
