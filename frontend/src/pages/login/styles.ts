import { Paper } from '@mui/material';
import { styled } from 'styled-components';

export const LoginWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f3f4f6;
`;

export const StyledPaper = styled(Paper)`
  padding: 2rem;
  width: 100%;
  max-width: 400px;
`;