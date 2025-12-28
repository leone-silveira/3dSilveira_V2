import React from "react";
import { StyledBox } from "./styles";
import { ListItemButton } from "@mui/material";


export const Navbar: React.FC = () => {
  return (
    <div>
      <StyledBox>
        <ListItemButton onClick={() => {}}>Dash</ListItemButton>
        <ListItemButton onClick={() => {}}>Cook</ListItemButton>
        <ListItemButton onClick={() => {}}>Learn</ListItemButton>
        <ListItemButton onClick={() => {}}>Gym</ListItemButton>
      </StyledBox>

    </div>
  );
}