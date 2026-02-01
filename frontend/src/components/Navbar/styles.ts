import { Box } from '@mui/material';
import styled from 'styled-components';

export const StyledBox = styled(Box)`
  background: linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%);
  width: 100%;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0 30px;
  flex-direction: row;
  gap: 30px;
  border-bottom: 2px solid #66bb6a;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  color: #ffffff;
  position: sticky;
  top: 0;
  z-index: 100;
  
  button {
    color: #ffffff;
    font-weight: 500;
    position: relative;
    overflow: hidden;
    
    &:hover {
      color: #66bb6a;
      background-color: rgba(102, 187, 106, 0.1);
    }
    
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background-color: #66bb6a;
      transform: translateX(-100%);
      transition: transform 0.3s ease;
    }
    
    &:hover::after {
      transform: translateX(0);
    }
  }
`;
