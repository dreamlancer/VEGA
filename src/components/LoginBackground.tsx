import React from 'react';
import styled from 'styled-components';

const backgroundLimits = 23;

const randomNumber = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

interface LoginBackgroundProps {
  children: React.ReactNode;
}
interface BackgroundProps {
  image: string;
}

const Background = styled.div`
  height: 100vh;
  width: 100vw;
  background-size: cover;
  background-image: url('https://www.vega.com.uy/app/bg/${randomNumber(
    0,
    backgroundLimits
  )}.jpg');
`;

export const LoginBackground = ({ children }: LoginBackgroundProps) => (
  <Background>{children}</Background>
);
