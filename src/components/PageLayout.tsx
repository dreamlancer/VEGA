import React, { useState } from 'react';
import { Layout, Menu, Alert, Typography, Divider, Space } from 'antd';
import logo from 'assets/logoColor.png';
import logoMini from 'assets/logoMiniColor.png';
import styled, { css } from 'styled-components';
import {
  LogoutOutlined,
  BookOutlined,
  SettingOutlined,
  PlusOutlined,
  FileTextOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { routes } from 'constants/routes';
import { Link, useLocation } from 'react-router-dom';
import { RootState } from 'store';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from 'store/app';
import { AlertProps } from 'antd/lib/alert';
import { Message } from 'api/getMessages';
import { Footer } from './Footer';
import { useMediaQuery } from 'react-responsive';

const { Sider, Header } = Layout;

interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
  whiteBg?: boolean;
  padding?: boolean;
}

interface LogoProps {
  collapsed: boolean;
}
const Logo = styled.img<LogoProps>`
  height: auto;
  width: 100%;
  padding: 32px 16px;
  ${({ collapsed }) =>
    collapsed &&
    css`
      max-height: 100px;
    `}
  object-fit: contain;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  max-width: 1120px;
  width: 100%;
  margin: 24px auto;
  min-height: 80vh;
`;

interface PageProps {
  whiteBg: boolean;
  padding: boolean;
}

const Page = styled.div<PageProps>`
  ${({ padding }) =>
    padding &&
    css`
      padding: 24px 48px;
    `}

  ${({ whiteBg }) =>
    whiteBg &&
    css`
      background-color: white;
    `}
`;

const StyledMenuItem = styled(Menu.Item)`
  display: flex;
  align-items: center;
  font-size: 16px !important;
`;

const StyledHeader = styled(Header)`
  color: white;
`;

const messageTypeColor: {
  [key in Message['Severidad']]: AlertProps['type'];
} = {
  Alta: 'error',
  Media: 'warning',
  Baja: 'info',
};

let isDefaultPassword = false;
export const setIsDefaultPassword = (value:boolean) => {
  isDefaultPassword = value;
}

export const PageLayout = ({
  children,
  title,
  whiteBg = true,
  padding = true,
}: PageLayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const isMobile = useMediaQuery({ query: `(max-width: 720px)` });

  const dispatch = useDispatch();

  const { licence, rut, name, messages, isAdmin } = useSelector(
    ({ app }: RootState) => app
  );

  const isUserDisabled = licence === 0;
  

  const doLogout = () => dispatch(logout());

  return (
    <WrapperLayout>
      <Sider
        breakpoint="lg"
        collapsible
        onCollapse={setCollapsed}
        width={isMobile ? 180 : 250}
        collapsedWidth={isMobile ? 0 : undefined}
        collapsed={collapsed}
      >
        <Logo src={collapsed ? logoMini : logo} alt="" collapsed={collapsed} />
        <Menu
          mode="inline"
          selectedKeys={isUserDisabled || isDefaultPassword ? [] : [location.pathname]}
          theme="dark"
        >
          <StyledMenuItem key={routes.home} disabled={isUserDisabled || isDefaultPassword}>
            <FileTextOutlined />
            <span>Documentos</span>
            <Link to={routes.home} />
          </StyledMenuItem>
          <StyledMenuItem key={routes.new} disabled={isUserDisabled || isDefaultPassword}>
            <PlusOutlined />
            <span>Ingresar</span>
            <Link to={routes.new} />
          </StyledMenuItem>
          <StyledMenuItem key={routes.agenda} disabled={isUserDisabled || isDefaultPassword}>
            <BookOutlined />
            <span>Agenda</span>
            <Link to={routes.agenda} />
          </StyledMenuItem>
          <StyledMenuItem key={routes.config} disabled={isUserDisabled || isDefaultPassword}>
            <SettingOutlined />
            <span>Configuración</span>
            <Link to={routes.config} />
          </StyledMenuItem>
          <StyledMenuItem key="logout" onClick={doLogout}>
            <LogoutOutlined />
            <span>Cerrar Sesión</span>
          </StyledMenuItem>
        </Menu>
      </Sider>
      <FullLayout>
        <StyledHeader>
          {name} <Divider type="vertical" /> RUT: {rut}
          <Divider type="vertical" /> Licencia: {licence} días restantes
          {isAdmin && (
            <>
              <Divider type="vertical" /> Administrador
            </>
          )}
        </StyledHeader>
        {messages.map((m, i) => (
          <CustomAlert
            message={m.Mensaje}
            banner
            description={m.Descripcion}
            key={i}
            closable={m.Cerrable}
            type={messageTypeColor[m.Severidad]}
          />
        ))}
        <Container>
          {isUserDisabled ? (
            <div>
              <Typography>
                <Typography.Title>
                  <Space direction="horizontal">
                    <WarningOutlined />
                    ATENCIÓN: LICENCIA CADUCADA
                  </Space>
                </Typography.Title>
                <Page padding whiteBg style={{ fontSize: '16px' }}>
                  <Typography.Paragraph>
                    Lamentablemente su empresa ha sido suspendida y los
                    servicios de emisión, comunicación y consultas, han sido
                    detenidos.
                  </Typography.Paragraph>
                  <Typography.Paragraph>
                    Rogamos regularizar su situación a la brevedad.
                  </Typography.Paragraph>
                </Page>
              </Typography>
            </div>
          ) : (
            <div>
              <Typography>
                <Typography.Title>{title}</Typography.Title>
              </Typography>
              <Page whiteBg={whiteBg} padding={padding}>
                {children}
              </Page>
            </div>
          )}
          <Footer />
        </Container>
      </FullLayout>
    </WrapperLayout>
  );
};

const FullLayout = styled(Layout)`
  width: 100%;
`;

const WrapperLayout = styled(Layout)`
  height: 100vh;
  width: 100vw;
  position: fixed;
`;

const styleMap = {
  error: css`
    font-size: 16px;
    font-weight: bold;
    background-color: #fca8a7;
  `,
  warning: css`
    font-size: 16px;
  `,
  success: css``,
  info: css``,
};

const CustomAlert = styled(Alert)`
  ${({ type }) => type && styleMap[type]}
`;
