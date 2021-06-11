import React, { useState } from 'react';
import { login, isAdmin, isAccountant, canExport } from 'api';
import { Card, Form, Input, Button, Alert } from 'antd';
import styled from 'styled-components';
import logo from 'assets/logoColor.png';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Store } from 'antd/lib/form/interface';
import { LoginBackground } from 'components/LoginBackground';
import { useDispatch } from 'react-redux';
import { loginSuccess, setError } from 'store/app';
import { useHistory } from 'react-router-dom';
import { routes } from 'constants/routes';
import { setName } from 'screens/Config';
import { updateImportEqualsDeclaration } from 'typescript';
import { setIsDefaultPassword } from 'components/PageLayout';

const Page = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Logo = styled.img`
  object-fit: contain;
  margin-bottom: 24px;
  width: 100%;
  height: auto;
`;

const LoginBtn = styled(Button)`
  width: 100%;
`;

const LoginCard = styled(Card)`
  background-color: rgba(255, 255, 255, 0.9);
  margin: 24px;
`;

export const LoginScreen = () => {
  const [state, setState] = useState({
    loading: false,
    error: '',
  });

  const dispatch = useDispatch();
  const history = useHistory();

  const handleFinish = (values: Store) => {
    const { rut, password } = values;
    doLogin(rut, password);
  };

  const doLogin = async (rut: string, password: string) => {

    setState({ loading: true, error: '' });
    try {
      const [
        loginResult,
        adminResult,
        isAccountantResult,
        canExportResult,
      ] = await Promise.all([
        login(rut, password),
        isAdmin(password),
        isAccountant(rut, password),
        canExport(rut, password),
      ]);
      if (isNaN(Number(loginResult))) {
        setState({ error: loginResult, loading: false });
      } else {
        setState((prev) => ({ ...prev, loading: false }));
        dispatch(
          loginSuccess({
            isAdmin: adminResult,
            rut,
            id: Number(loginResult),
            isAccountant: isAccountantResult,
            canExport: canExportResult,
          })
        );
        
        if(password == "1234" || password == "12345") {
          setIsDefaultPassword(true);
          history.push(routes.informpassword);
        }
        else {
          setIsDefaultPassword(false);
          history.push(routes.home);
        }
        
      }
    } catch (error) {
      dispatch(setError(error));
    }
  };

  return (
    <LoginBackground>
      <Page>
        <LoginCard>
          <Logo src={logo} alt="" />
          <Form onFinish={handleFinish} layout={'vertical'}>
            <Form.Item
              name="rut"
              rules={[
                { required: true, message: 'Por favor ingrese su RUT' },
                {
                  required: true,
                  message: 'Utilice un RUT Válido',
                  len: 12,
                  pattern: /[0-9]{12}/,
                },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="RUT"
                autoComplete="username"
                maxLength={12}
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: 'Por favor ingrese su contraseña' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Contraseña"
                autoComplete="current-password"
              />
            </Form.Item>
            {state.error && (
              <Form.Item>
                <Alert message={state.error} type="error" showIcon />
              </Form.Item>
            )}
            <Form.Item>
              <LoginBtn
                type="primary"
                htmlType="submit"
                loading={state.loading}
              >
                Ingresar
              </LoginBtn>
            </Form.Item>
          </Form>
        </LoginCard>
      </Page>
    </LoginBackground>
  );
};
