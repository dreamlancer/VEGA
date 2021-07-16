import React from 'react';
import { Client } from 'api';
import { PeopleType } from './ClientTable';
import { Form, Input, Button, Space, Select, Row, Col } from 'antd';
import styled from 'styled-components';
import { departamentos } from 'constants/departamentos';
import { Store } from 'antd/lib/form/interface';
import { isArray } from 'util';
import { ciRegex, rutRegex } from 'constants/regex';

interface ClientFormProps {
  client?: Client;
  type: PeopleType;
  onSubmit: (client: Client) => void;
  onCancel: () => void;
}

const PrefixSelect = styled(Select)`
  width: 70x;
`;

const prefixSelector = (
  <Form.Item name="documentType" noStyle>
    <PrefixSelect>
      <Select.Option value="RUT">RUT</Select.Option>
      <Select.Option value="CI">CI</Select.Option>
    </PrefixSelect>
  </Form.Item>
);


export type NamePath = string | number | (string | number)[];
export interface FieldData {
  touched?: boolean;
  validating?: boolean;
  errors?: string[];
  name: NamePath;
  value?: any;
}

export const ClientForm = ({
  client,
  type,
  onSubmit,
  onCancel,
}: ClientFormProps) => {
  const [form] = Form.useForm();

  const handleFinish = (values: Store) => {
    onSubmit({
      ciudad: values.ciudad,
      departamento: values.departamento,
      direccion: values.direccion,
      nombre: values.nombre,
      cedula: values.documentType === 'CI' ? values.document : '',
      rut: values.documentType === 'RUT' ? values.document : '',
      id: client?.id,
    });

    form.resetFields();
  };

  const handleKeyBlockdownEvent = (event:any) => {
    if(event.keyCode == 55 && event.shiftKey) {
      event.preventDefault();
    }
  }

  const handleFieldsChange = (changedFields: FieldData[]) => {
    if (
      changedFields.some((f) => {
        if (typeof f.name === 'string') {
          return f.name === 'documentType';
        } else if (isArray(f.name)) {
          return f.name.includes('documentType');
        }
      })
    ) {
      form.resetFields(['document']);
    }
  };

  const clientToform = ({
    nombre,
    ciudad,
    departamento,
    direccion,
    cedula,
    rut,
  }: Client) => ({
    nombre,
    ciudad,
    departamento,
    direccion,
    documentType: cedula ? 'CI' : 'RUT',
    document: cedula ? cedula : rut,
  });

  return (
    <Form
      layout="vertical"
      onFinish={handleFinish}
      hideRequiredMark
      form={form}
      onFieldsChange={handleFieldsChange}
      initialValues={{
        documentType: 'RUT',
        ...(client && clientToform(client)),
      }}
    >
      <Row gutter={24}>
        <Col xl={12} sm={24}>
          <Form.Item
            name="nombre"
            label="Nombre"
            rules={[{ required: true, message: 'Nombre es requerido' }]}
          >
            <Input onKeyDown = {handleKeyBlockdownEvent}/>
          </Form.Item>
          <Form.Item
            name="ciudad"
            label="Ciudad"
            rules={[{ required: true, message: 'Ciudad es requerido' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="departamento"
            label="Departamento"
            rules={[{ required: true, message: 'Departamento es requerido' }]}
          >
            <Select placeholder="Seleccione Departamento">
              {departamentos.map((d) => (
                <Select.Option key={d} value={d}>
                  {d}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col xl={12} sm={24}>
          <Form.Item
            name="direccion"
            label="Dirección"
            rules={[{ required: true, message: 'Dirección es requerido' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="document"
            label="Documento"
            rules={[
              { required: true, message: 'Documento es requerido' },
              ({ getFieldValue }) => {
                return getFieldValue('documentType') === 'RUT'
                  ? {
                      pattern: rutRegex,
                      message: 'Ingrese un RUT Válido',
                      len: 12,
                    }
                  : {
                      pattern: ciRegex,
                      message: 'Ingrese una Cédula Válida ej: 4.283.298-4',
                    };
              },
            ]}
          >
            <Input addonBefore={prefixSelector} maxLength={12} />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item>
        <FullSpace>
          <Button onClick={onCancel}>Cancelar</Button>
          <Button type="primary" htmlType="submit">
            Guardar
          </Button>
        </FullSpace>
      </Form.Item>
    </Form>
  );
};

export const FullSpace = styled(Space)`
  width: 100%;
  display: flex;
  justify-content: flex-end;
`;
