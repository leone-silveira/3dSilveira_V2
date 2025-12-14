import React from "react";
import styled from "styled-components";

type Props = {
  title?: string;
  right?: React.ReactNode;
  children?: React.ReactNode; // for optional logo/icon on the left
};

const Root = styled.header`
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  background: var(--app-bg, #ffffff);
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.02);
  z-index: 20;
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary, #111827);
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const Navbar: React.FC = ({ title = "3dSilveira", right, children }: Props) => {
  return (
    <Root>
      <Left>
        {children}
        <Title>{title}</Title>
      </Left>

      <Right>{right}</Right>
    </Root>
  );
}