import { Box } from "@mui/material";
import styled from 'styled-components';

interface sideBarBoxProps {
  isOpened?: boolean;
}

export const SideBarBox = styled(Box)<sideBarBoxProps>`
  background-color: #f0f0f0;
  width: ${props => props.isOpened ? '15%' : '3%'};
  display: flex;
  height: 80vh;
  align-items: center;
//   justify-content: space-around;
  padding: 10px;
  flex-direction: column;
  position: fixed;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  color: purple;
  z-index: 1000;
  transition: width 0.1s ease-in-out;
  
`;