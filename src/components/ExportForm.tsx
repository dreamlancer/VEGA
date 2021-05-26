import React, { useState } from 'react';
import { Form, Select, DatePicker, Button, Spin } from 'antd';
import { Store } from 'antd/lib/form/interface';
import { ExportOutlined } from '@ant-design/icons';
import { datepickerLocale } from 'constants/datepickerLocale';
import styled from 'styled-components';
import moment from 'moment';
import { Document, getAllCompras, getAllDocuments } from 'api';
import printExcel from 'utils/printExcel';
import { RootState } from 'store';
import { useSelector } from 'react-redux';
import { message } from 'antd';

const { Option } = Select;
const { RangePicker } = DatePicker;

const Container = styled.div`
  max-width: 15rem;
`;

interface State {
  type: 'Ventas' | 'Compras';
  dates: [moment.Moment, moment.Moment];
}

export const ExportForm = () => {
  const [{ isLoading }, setState] = useState<{
    isLoading: boolean;
    error?: boolean;
  }>({
    isLoading: false,
  });

  const { canExport, rut, id, isAccountant } = useSelector(
    ({ app }: RootState) => app
  );

  const handleFinish = async (values: Store) => {
    if (!canExport) {
      return;
    }
    const { type, dates } = values as State;
    const [inicial, final] = dates;
    const filename = type;
    setState({ isLoading: false });
    let data = [];
    try {
      data =
        type === 'Compras'
          ? await getAllCompras(
              rut as string,
              id as number,
              isAccountant,
              inicial.format('DD-MM-yyyy'),
              final.format('DD-MM-yyyy')
            )
          : await getAllDocuments(
              rut as string,
              id as number,
              isAccountant,
              inicial.format('DD-MM-yyyy'),
              final.format('DD-MM-yyyy')
            );
      setState({ isLoading: false, error: false });
    } catch (error) {
      console.log(`Error in type ${type}`);
      console.log(error);
      message.error(
        'Ocurrió un error inesperado. Verifique e intente nuevamente.'
      );
      return setState({ isLoading: false, error: true });
    }
    if (!data.length) {
      return message.error('No hay datos para el rango seleccionado.');
    }

    const filtered = data.filter((document) => {
      const date = moment(document.fecha, 'DD/MM/YYYY');

      if (type === 'Compras') {
        return (
          date.isSameOrAfter(inicial, 'day') &&
          date.isSameOrBefore(final, 'day')
        );
      }
      return (
        date.isSameOrAfter(inicial, 'day') &&
        date.isSameOrBefore(final, 'day') &&
        document.estado === 'Aceptado'
      );
    });

    const mapped = filtered.map((c) => {
      const ncRegex = /NC/;
      const isNC = ncRegex.test(c.cfe);
      var str_subtotal = isNC ? `-${c.subtotal}` : c.subtotal;
      str_subtotal = str_subtotal.split(".").join("");
      str_subtotal = str_subtotal.split(",").join(".");
      var str_iva = isNC ? `-${c.iva}` : c.iva;
      str_iva = str_iva.split(".").join("");
      str_iva = str_iva.split(",").join(".");
      var str_importe = isNC ? `-${c.importe}` : c.importe;
      str_importe = str_importe.split(".").join("");
      str_importe = str_importe.split(",").join(".");
      if (type === 'Compras') {
        return {
          CFE: c.cfe,
          Serie: c.serie,
          Numero: c.numero,
          Fecha: c.fecha,
          Cliente: c.cliente,
          Subtotal: parseFloat(str_subtotal),
          IVA: parseFloat(str_iva),
          Importe: parseFloat(str_importe),
          Moneda: c.moneda,
          TipoPago: c.tipoPago,
        };
      }
      return {
        CFE: c.cfe,
        Serie: c.serie,
        Numero: c.numero,
        Fecha: c.fecha,
        Cliente: c.cliente,
        Subtotal: parseFloat(str_subtotal),
        IVA: parseFloat(str_iva),
        Importe: parseFloat(str_importe),
        Moneda: c.moneda,
        TipoPago: c.tipoPago,
      };
    });

    printExcel(mapped, filename);
  };

  return (
    <Spin spinning={isLoading}>
      <Container>
        <Form
          onFinish={handleFinish}
          layout="vertical"
          initialValues={{ type: 'Ventas' }}
          hideRequiredMark
        >
          <Form.Item name="type" label="Exportar">
            <Select defaultValue="Ventas">
              <Option value="Ventas">Ventas</Option>
              <Option value="Compras">Compras</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="dates"
            label="Fechas"
            rules={[
              {
                required: true,
                message: 'Por favor seleccione un rango de fechas',
              },
              () => ({
                validator(rule, value: [moment.Moment, moment.Moment]) {
                  if (!value) {
                    return Promise.reject('');
                  }
                  const [initial, end] = value;
                  return initial.isBefore(end)
                    ? Promise.resolve()
                    : Promise.reject(
                        'Fecha inicial debe ser anterior a la final'
                      );
                },
              }),
            ]}
          >
            <RangePicker locale={datepickerLocale} format="DD/MM/YYYY" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" disabled={!canExport}>
              <ExportOutlined />
              Exportar
            </Button>
          </Form.Item>
        </Form>
      </Container>
    </Spin>
  );
};
