import React from 'react';
import { Form, Select } from 'antd';
import { countries } from 'constants/countries';

const { Option } = Select;

export const SelectCondVenta = () => {
  return (
    <Form.Item
      name="condicionVenta"
      label="Condición de venta"
      rules={[{ required: true, message: 'Condición de venta es requerido' }]}
    >
      <Select>
        <Option value="XIF">XIF</Option>
        <Option value="EXW">EXW</Option>
        <Option value="FOB">FOB</Option>
        <Option value="N/A">N/A</Option>
      </Select>
    </Form.Item>
  );
};

export const SelectModVenta = () => {
  return (
    <Form.Item
      name="modalidadVenta"
      label="Modalidad de venta"
      rules={[{ required: true, message: 'Modalidad de venta es requerido' }]}
    >
      <Select>
        <Option value="1">Régimen general</Option>
        <Option value="2">Consignación</Option>
        <Option value="3">Precio revisable</Option>
        <Option value="4">Bienes propios a exclaves aduaneros</Option>
        <Option value="90">Régimen general exportación de servicios</Option>
        <Option value="99">Otras transacciones</Option>
      </Select>
    </Form.Item>
  );
};

export const SelectTransporte = () => {
  return (
    <Form.Item
      name="transporte"
      label="Transporte"
      rules={[{ required: true, message: 'Transporte es requerido' }]}
    >
      <Select>
        <Option value="1">Marítimo</Option>
        <Option value="2">Aéreo</Option>
        <Option value="3">Terrestre</Option>
        <Option value="8">N/A</Option>
        <Option value="9">Otro</Option>
      </Select>
    </Form.Item>
  );
};

export const SelectPais = () => {
  return (
    <Form.Item
      name="pais"
      label="País"
      rules={[{ required: true, message: 'País es requerido' }]}
    >
      <Select showSearch optionFilterProp="children">
        {countries.map((c) => (
          <Option key={c.code} value={c.code}>
            {c.label.trim()}
          </Option>
        ))}
      </Select>
    </Form.Item>
  );
};
