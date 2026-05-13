import { Box } from '@mui/material';
import styled from 'styled-components';

export const StyledBox = styled(Box)`
  background: rgba(13, 13, 13, 0.95);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  width: 100%;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px 0 16px;
  flex-direction: row;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
  box-shadow: 0 1px 0 rgba(255,255,255,0.04), 0 4px 20px rgba(0,0,0,0.5);
  color: #f0f0f0;
  position: sticky;
  top: 0;
  z-index: 1000;
  gap: 8px;

  @media (max-width: 768px) {
    padding: 0 12px;
  }
`;

export const NavItems = styled(Box)`
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 1;
  min-width: 0;

  @media (max-width: 480px) {
    gap: 2px;
  }
`;

export const NavButton = styled.button<{ active?: boolean }>`
  background: ${props => props.active ? 'rgba(102,187,106,0.12)' : 'transparent'};
  color: ${props => props.active ? '#66bb6a' : '#9e9e9e'};
  border: ${props => props.active ? '1px solid rgba(102,187,106,0.25)' : '1px solid transparent'};
  border-radius: 10px;
  padding: 7px 16px;
  font-size: 0.875rem;
  font-weight: ${props => props.active ? '600' : '500'};
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;

  &:hover {
    color: #66bb6a;
    background: rgba(102, 187, 106, 0.1);
    border-color: rgba(102, 187, 106, 0.2);
  }

  @media (max-width: 600px) {
    padding: 7px 9px;
    font-size: 0;
    gap: 0;

    svg {
      font-size: 18px !important;
    }
  }
`;

export const LogoBadge = styled(Box)`
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: linear-gradient(135deg, #66bb6a, #388e3c);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 10px rgba(102, 187, 106, 0.3);
  flex-shrink: 0;
`;

export const MobileMenuButton = styled.button`
  display: none;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  width: 36px;
  height: 36px;
  align-items: center;
  justify-content: center;
  color: #9e9e9e;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    color: #66bb6a;
    border-color: rgba(102, 187, 106, 0.25);
    background: rgba(102, 187, 106, 0.06);
  }

  @media (max-width: 768px) {
    display: flex;
  }
`;
