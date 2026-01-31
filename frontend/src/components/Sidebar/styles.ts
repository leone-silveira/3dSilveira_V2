import { Box } from "@mui/material";
import styled from 'styled-components';

interface sideBarBoxProps {
  isOpened?: boolean;
}

export const SideBarBox = styled(Box)<sideBarBoxProps>`
  background: linear-gradient(180deg, #1e1e1e 0%, #252525 100%);
  width: ${props => props.isOpened ? '16%' : '80px'};
  display: flex;
  height: calc(100vh - 70px);
  margin-top: 70px;
  align-items: flex-start;
  padding: 20px 0;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  border-right: 1px solid #333333;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.3);
  color: #ffffff;
  z-index: 999;
  transition: width 0.3s ease-in-out;
  overflow-y: auto;
  overflow-x: hidden;
  
  button {
    width: 100%;
    justify-content: ${props => props.isOpened ? 'flex-start' : 'center'};
    color: #b0bec5;
    transition: all 0.3s ease;
    padding: 12px 10px;
    
    &:hover {
      background-color: rgba(102, 187, 106, 0.1);
      color: #66bb6a;
    }
    
    svg {
      min-width: 24px;
    }
  }
  
  hr {
    width: 80%;
    margin: 10px auto;
    border-color: #333333;
  }
`;