import React from 'react';
import { Layout, Space } from 'antd';
import styled from 'styled-components';
import logoInfra from 'assets/logoInfra.png';
import {
  TwitterOutlined,
  WhatsAppOutlined,
  FacebookOutlined,
  PhoneOutlined,
  MailOutlined,
} from '@ant-design/icons';

const { Footer: AFooter } = Layout;

const Logo = styled.img`
  max-height: 70px;
  width: auto;
`;

export const Footer = () => {
  return (
    <Container>
      <a
        href="http://infrasistemas.com.uy/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Logo src={logoInfra} alt="" />
      </a>
      <Line />
      <LastRow>
        <Space direction="horizontal">
          <Space direction="horizontal">
            <StyledIcon>
              <PhoneOutlined />
            </StyledIcon>
            4532 8662 | 091 402 669
          </Space>
          <Space direction="horizontal">
            <StyledIcon>
              <MailOutlined />
            </StyledIcon>
            info@infrasistemas.com.uy
          </Space>
        </Space>
        <SocialMedia>
          <Space size="large">
            <UnstyledLink
              href="http://www.twitter.com/InfraSistemas"
              target="_blank"
              rel="noopener noreferrer"
            >
              <TwitterOutlined />
            </UnstyledLink>
            <UnstyledLink
              href="https://wa.me/59891402669"
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsAppOutlined />
            </UnstyledLink>
            <UnstyledLink
              href="https://www.facebook.com/Infra-Sistemas-345840233584"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FacebookOutlined />
            </UnstyledLink>
          </Space>
        </SocialMedia>
      </LastRow>
    </Container>
  );
};

const Line = styled.div`
  height: 4px;
  background-color: rgba(8, 81, 161, 0.9);
  margin: 16px 0;
`;

const StyledIcon = styled.span`
  font-size: 16px;
`;

const Container = styled(AFooter)`
  display: flex;
  flex-direction: column;
  align-self: flex-end;
  width: 100%;
  margin: 24px 0;
  padding: 0;
  a {
    width: fit-content;
  }
`;

const UnstyledLink = styled.a`
  text-decoration: none;
  color: initial;
  font-size: 24px;
`;

const SocialMedia = styled.div`
  align-self: center;
`;

const LastRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  @media (max-width: 720px) {
    flex-direction: column;
  }
`;
