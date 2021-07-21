import React, { useEffect } from 'react';
import { Form, Button, Select, Spin } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'store';
import { Store } from 'antd/lib/form/interface';
import { postPreferences, updatePreferences } from 'store/preferences';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 15rem;
`;
export const Preferences = () => {
  const { moneda, impuestos, impresion, tipoIva, state } = useSelector(
    ({ preferences }: RootState) => preferences
  );
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(updatePreferences());
  }, [dispatch]);

  useEffect(() => {
    form.resetFields();
  }, [moneda, impuestos, impresion, tipoIva, form]);

  const handleFinish = (values: Store) => {
    const { moneda, impuestos, impresion, tipoIva} = values;
    dispatch(postPreferences(moneda, impuestos, impresion, tipoIva));
  };

  return (
    <Spin spinning={state === 'LOADING'}>
      <Container>
        <Form
          layout="vertical"
          form={form}
          initialValues={{ moneda, impuestos, impresion, tipoIva }}
          onFinish={handleFinish}
        >
          <Form.Item name="impuestos" label="Pasar precios">
            <Select>
              <Select.Option value="IVA INC">IVA INC</Select.Option>
              <Select.Option value="+ IVA">+ IVA</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="moneda" label="Moneda preferencial">
            <Select>
              <Select.Option value="Pesos">Pesos</Select.Option>
              <Select.Option value="Dólares">Dólares</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="tipoIva" label="IVA">
            <Select>
              <Select.Option value="0%">0%</Select.Option>
              <Select.Option value="10%">10%</Select.Option>
              <Select.Option value="22%">22%</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="impresion" label="Tipo Impresión">
            <Select>
              <Select.Option value="A4">A4</Select.Option>
              <Select.Option value="Térmico">Térmico</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Guardar
            </Button>
          </Form.Item>
        </Form>
      </Container>
    </Spin>
  );
};
