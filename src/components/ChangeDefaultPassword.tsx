import React, { useState } from 'react';
import { Form, Button, Spin, Input, Typography, message } from 'antd';
import { Store } from 'antd/lib/form/interface';
import { changePass } from 'api';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import styled from 'styled-components';
import { setIsDefaultPassword } from 'components/PageLayout';
import { routes } from 'constants/routes';
import { useHistory } from 'react-router-dom';
import CSS from 'csstype';

const Container = styled.div`
  max-width: 15rem;
`;

const h4Styles: CSS.Properties = {
  width: '760px'
};

export const ChangeDefaultPassword = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  const rut = useSelector(({ app }: RootState) => app.rut);

  const [form] = Form.useForm();

  const handleFinish = async (values: Store) => {
    setLoading(true);
    const { password } = values;
    if( password == "1234" || password == "12345" ) {
      message.warning('La contraseña no puede ser tan fácil');
      form.resetFields();
      setLoading(false);
    } else if(password.length < 4){
      message.warning('La contraseña debe tener al menos 4 dígitos');
      form.resetFields();
      setLoading(false);
    } else {
      if (rut) {
        await changePass(rut, password);
        message.success('Se cambió la contraseña con éxito');
        form.resetFields();
        setIsDefaultPassword(false);
        history.push(routes.home);
        setLoading(false);
      }
    }
  };
  return (
    <Container>
      <Spin spinning={loading}>
        <Form
          form={form}
          onFinish={handleFinish}
          hideRequiredMark
          layout="vertical"
        >
          <Typography>
          </Typography>
            <Typography.Title level={4} style={h4Styles} >Debido a razones de seguridad, precisamos que actualice su contraseña por favor</Typography.Title>
          <Form.Item
            name="password"
            label="Nueva constraseña"
            rules={[{ required: true, message: 'Ingrese nueva contraseña' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Confirmar contraseña"
            name="passwordConfirm"
            rules={[
              { required: true, message: 'Confirme su contraseña' },
              ({ getFieldValue }) => ({
                validator(rule, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject('Las contraseñas no conciden');
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Cambiar
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </Container>
  );
};
