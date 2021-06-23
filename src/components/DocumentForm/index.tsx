import React, { useState, useEffect } from 'react';
import {
  Form,
  Row,
  Col,
  Input,
  Select,
  DatePicker,
  Space,
  Button,
  Spin,
  Tooltip,
  Typography,
  Result,
} from 'antd';
import { datepickerLocale } from 'constants/datepickerLocale';
import { PlusOutlined, DeleteOutlined, BookOutlined } from '@ant-design/icons';
import { RootState } from 'store';
import { useSelector, useDispatch } from 'react-redux';
import { FormProviderProps } from 'antd/lib/form/context';
import { isArray } from 'util';
import {
  ciRegex,
  rutRegex,
  codRetencionRegex,
  onlyNumbersRegex,
} from 'constants/regex';
import moment from 'moment';
import { formatImporte, round, roundToFour, showToFour, formatDecimal, formatNewDecimal } from 'utils';
import { getInterbancario } from 'store/app';
import { updateRemaining, postDocumentThunk, setPostState } from 'store/docs';
import { updatePreferences } from 'store/preferences';
import styled from 'styled-components';
import { ClientModal } from '../ClientModal';
import { Client } from 'api';
import { useHistory, Link } from 'react-router-dom';
import {
  SelectCondVenta,
  SelectPais,
  SelectTransporte,
  SelectModVenta,
} from './Selects';

const { TextArea } = Input;

const { Option } = Select;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
};

const SelectIva = ({ disabled = false }: { disabled?: boolean }) => (
  <Form.Item name="tipoIva" noStyle>
    <Select disabled={disabled}>
      <Option value={1.22}>22%</Option>
      <Option value={1.1}>10%</Option>
      <Option value={1.0}>0%</Option>
    </Select>
  </Form.Item>
);

const SelectCurrency = ({ disabled = false }: { disabled?: boolean }) => (
  <Form.Item name="moneda" noStyle>
    <Select disabled={disabled}>
      <Option value="UYU">Pesos</Option>
      <Option value="USD">Dólares</Option>
    </Select>
  </Form.Item>
);

const PrefixSelect = styled(Select)`
  width: 70x;
`;

const rutOCiSelector = (
  <Form.Item name="documentType" noStyle>
    <PrefixSelect>
      <Select.Option value="RUT">RUT</Select.Option>
      <Select.Option value="CI">CI</Select.Option>
    </PrefixSelect>
  </Form.Item>
);

const resguardoOCiSelector = (
  <Form.Item name="referenciaType" noStyle>
    <PrefixSelect>
      <Select.Option value="Referencia">Referencia</Select.Option>
      <Select.Option value="Motivo">Motivo</Select.Option>
    </PrefixSelect>
  </Form.Item>
);

export type DocTypes = 'Ticket' | 'Factura' | 'Resguardo' | 'Exportación';

interface State {
  type: DocTypes;
  showAgenda: boolean;
  isNC: boolean;
}

const recalculateKeys = [
  'tipoIva',
  'descuento',
  'impuestos',
  'cantidad',
  'precio',
];

interface Totales {
  iva: number;
  descuentoTotal: number;
  neto: number;
  subtotal: number;
  total: number;
}

export interface Line {
  cantidad?: string;
  detalle?: string;
  precio?: string;
  total?: string;
}

export const DocumentForm = () => {
  const {
    remaining,
    preferences: { impuestos, moneda },
    isAdmin,
    loading,
    postState,
    error,
  } = useSelector(({ docs, preferences, app }: RootState) => ({
    remaining: docs.remaining,
    preferences,
    isAdmin: app.isAdmin,
    postState: docs.postState,
    error: docs.error,
    loading: docs.state === 'LOADING' || app.interbancario === null,
  }));

  const [totales, setTotales] = useState<Totales>();

  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    dispatch(getInterbancario());
    dispatch(updateRemaining());
    dispatch(updatePreferences());
  }, [dispatch]);

  const [state, setState] = useState<State>({
    type: 'Ticket',
    showAgenda: false,
    isNC: false,
  });

  const setAgenda = (value: boolean) =>
    setState((prev) => ({ ...prev, showAgenda: value }));

  const [bigForm] = Form.useForm();
  const [lineas] = Form.useForm();
  const [resguardo] = Form.useForm();

  const handleFormChange: FormProviderProps['onFormChange'] = (
    name: string,
    { changedFields, forms }
  ) => {
    if (name === 'bigForm') {
      const tipoField = changedFields.find((f) =>
        isArray(f.name) ? f.name.includes('tipo') : false
      );
      if (tipoField && tipoField.value != null) {
        const tipo = remaining[tipoField.value];
        let newType: DocTypes = 'Ticket';

        if (tipo.tipo.match(/ticket/gi)) {
          newType = 'Ticket' as const;
        } else if (tipo.tipo.match(/factura/gi)) {
          newType = 'Factura';
        } else if (tipo.tipo.match(/resguardo/gi)) {
          newType = 'Resguardo';
        } else if (tipo.tipo.match(/export/gi)) {
          newType = 'Exportación';
          forms.bigForm.setFieldsValue({ tipoIva: 1.0, moneda: 'USD' });
        }
        if (tipo.tipo.match(/nc/gi)) {
          setState((prev) => ({ ...prev, type: newType, isNC: true }));
        } else {
          setState((prev) => ({ ...prev, type: newType, isNC: false }));
        }

        forms.bigForm.setFieldsValue({
          serie: tipo.serie,
          numero: tipo.desde + tipo.utilizados,
          documentType: newType === 'Resguardo' ? 'RUT' : 'CI',
        });
      }
    }

    if (
      changedFields.some((field) => {
        if (isArray(field.name)) {
          return field.name.some((n) => recalculateKeys.includes(String(n)));
        } else {
          return recalculateKeys.includes(String(field.name));
        }
      })
    ) {
      const lineas = forms.lines.getFieldsValue().lineas as Line[];

      const lineasWithTotals = lineas.map((line) => ({
        ...line,
        precio:
          line.precio && Number(line.precio)
            ? showToFour(Number(line.precio))
            : line.precio,
        cantidad:
          line.cantidad && Number(line.cantidad)
            ? showToFour(Number(line.cantidad))
            : line.cantidad,
        total: formatImporte(
          round((Number(line.cantidad) || 1) * (Number(line.precio) || 0))
        ),
      }));

      forms.lines.setFieldsValue({ lineas: lineasWithTotals });

      const {
        descuento = 0,
        tipoIva,
        impuestos,
      } = forms.bigForm.getFieldsValue();

      const ivaIncluido = impuestos === 'IVA INC';

      const totals = lineas.map((line) => {
        const cantidad = Number(line.cantidad) || 1;
        const unitario = Number(line.precio) || 0;
        return round(cantidad * unitario);
      });

      const linesTotal = totals.reduce((acc, l) => acc + l, 0);

      const subtotal = ivaIncluido ? linesTotal / tipoIva : linesTotal;

      const neto = subtotal * (1 - descuento / 100);

      const descuentoTotal = subtotal - neto;
      const total = neto * tipoIva;
      const iva = total - neto;

      setTotales({
        iva,
        descuentoTotal,
        neto,
        subtotal,
        total,
      });

      forms.bigForm.setFieldsValue({
        ivaFormatted: formatImporte(iva),
        descuentoTotalFormatted: formatImporte(descuentoTotal),
        netoFormatted: formatImporte(neto),
        subtotalFormatted: formatImporte(neto),
        totalFormatted: formatImporte(total),
      });
    }
  };
  const handleFormFinish: FormProviderProps['onFormFinish'] = async (
    name: string,
    { values, forms }
  ) => {
    if (name === 'bigForm') {
      if (state.type !== 'Resguardo') {
        const { lineas } = await forms.lines.validateFields();
        const tipo = remaining[values.tipo];

        const payload = {
          ...values,
          ...totales,
          cfe: tipo.CFE,
          lineas,
        };
        dispatch(postDocumentThunk({ doc: payload, lineas, type: state.type }));
      } else {
        const resguardoFields = await forms.resguardo.validateFields();

        const imponible = resguardoFields.montoImponible || 0;
        const tasa = resguardoFields.tasa;
        const montoRetenido = imponible * (tasa / 100);

        const payload = {
          ...values,
          ...resguardoFields,
          total: montoRetenido,
          cfe: 182,
        };

        dispatch(
          postDocumentThunk({
            doc: payload,
            type: state.type,
            resguardo: resguardoFields,
          })
        );
      }
    }
  };

  const dateChecks = (date: moment.Moment): boolean => {
    const today = moment();
    if (date.isBefore(today)) {
      return date.isBefore(today.subtract(isAdmin ? 999 : 40, 'days'));
    }
    return date.isAfter(today.add(1, 'day').startOf('day'));
  };

  const handleClient = (client: Client) => {
    const facturaIndex = remaining.findIndex((r) => r.tipo === 'e-Factura');
    const ticketIndex = remaining.findIndex((r) => r.tipo === 'e-Ticket');

    const newIndex = client.rut ? facturaIndex : ticketIndex;
    const newValidIndex = newIndex === -1 ? 0 : newIndex;

    const tipo = remaining[newValidIndex];
    let newType: DocTypes = 'Ticket';

    if (tipo.tipo.match(/ticket/gi)) {
      newType = 'Ticket' as const;
    } else if (tipo.tipo.match(/factura/gi)) {
      newType = 'Factura';
    }
    if (state.type !== 'Resguardo') {
      setState((prev) => ({
        ...prev,
        type: newType,
        isNC: !!tipo.tipo.match(/nc/gi),
      }));
    }

    state.type === 'Resguardo'
      ? bigForm.setFieldsValue(client)
      : bigForm.setFieldsValue({
          ...client,
          tipo: newValidIndex,
          serie: tipo.serie,
          numero: tipo.desde + tipo.utilizados,
        });
    setAgenda(false);
  };

  const resetState = () => {
    bigForm.resetFields();
    lineas.resetFields();
    resguardo.resetFields();
    dispatch(setPostState({ state: 'READY' }));
    setState({
      type: 'Ticket',
      showAgenda: false,
      isNC: false,
    });
    setTotales(undefined);
  };

  const handleKeydownEvent = (event:any) => {
    if(event.keyCode === 190 || event.keyCode === 110) {
      event.preventDefault();
    }
  }

  useEffect(() => {
    if (remaining.length) {
      const tipo = remaining[0];
      let newType: DocTypes = 'Ticket';

      if (tipo.tipo.match(/ticket/gi)) {
        newType = 'Ticket' as const;
      } else if (tipo.tipo.match(/factura/gi)) {
        newType = 'Factura';
      } else if (tipo.tipo.match(/resguardo/gi)) {
        newType = 'Resguardo';
      }
      if (tipo.tipo.match(/nc/gi)) {
        setState((prev) => ({ ...prev, type: newType, isNC: true }));
      } else {
        setState((prev) => ({ ...prev, type: newType, isNC: false }));
      }
    }
  }, [remaining]);

  if (postState === 'ERROR' || postState === 'SUCCESS') {
    const isSuccess = postState === 'SUCCESS';
    return (
      <Section>
        <Result
          status={isSuccess ? 'success' : 'error'}
          title={
            isSuccess
              ? 'Su documento se creó con éxito'
              : 'A ocurrido un error al crear el documento'
          }
          subTitle={isSuccess ? undefined : error?.toString()}
          extra={[
            <Link to="/" onClick={resetState}>
              <Button type="primary">Ir a mis Documentos</Button>
            </Link>,
            <Button key="buy" onClick={resetState}>
              Ingresar otro Documento
            </Button>,
          ]}
        />
      </Section>
    );
  }

  return (
    <Spin spinning={loading || postState === 'LOADING'}>
      <ClientModal
        type={state.type === 'Resguardo' ? 'Provider' : 'Client'}
        onCancel={() => setAgenda(false)}
        onOk={handleClient}
        visible={state.showAgenda}
      />
      <Form.Provider
        onFormChange={handleFormChange}
        onFormFinish={handleFormFinish}
      >
        {remaining.length ? (
          <Form
            size="large"
            form={bigForm}
            name="bigForm"
            {...formItemLayout}
            labelAlign="left"
            initialValues={{
              moneda: moneda === 'Dólares' ? 'USD' : 'UYU',
              impuestos,
              formaPago: 'Contado',
              tipoIva: 1.22,
              tipo: 0,
              serie: remaining[0].serie,
              numero: remaining[0].desde + remaining[0].utilizados,
              fecha: moment(new Date()),
              descuento: 0,
              observaciones: '',
              ordenCompra: '',
              iva: 0,
              descuentoTotal: 0,
              neto: 0,
              subtotal: 0,
              total: 0,
              documentType: 'CI',
              referenciaType: 'Referencia',
            }}
            hideRequiredMark
          >
            <Section>
              <Row justify="space-between" gutter={32}>
                <Col xl={12} sm={24}>
                  <Form.Item
                    name="nombre"
                    label="Nombre"
                    shouldUpdate={(prev, curr) => prev.nombre !== curr.nombre}
                    rules={[
                      {
                        required: state.type === 'Ticket' ? false : true,
                        message: 'Nombre es requerido',
                      },
                    ]}
                  >
                    <Input
                      suffix={
                        <ClickableIcon
                          title="Agenda"
                          type="primary"
                          onClick={() => setAgenda(true)}
                        >
                          <BookOutlined />
                        </ClickableIcon>
                      }
                    />
                  </Form.Item>
                  <Form.Item
                    name="direccion"
                    label="Dirección"
                    rules={[
                      {
                        required: state.type === 'Ticket' ? false : true,
                        message: 'Dirección es requerido',
                      },
                    ]}
                  >
                    <Input maxLength={70} />
                  </Form.Item>
                  <Form.Item
                    name="ciudad"
                    label="Ciudad"
                    rules={[
                      {
                        required: state.type === 'Ticket' ? false : true,
                        message: 'Ciudad es requerido',
                      },
                    ]}
                  >
                    <Input maxLength={30} />
                  </Form.Item>
                  <Form.Item
                    name="departamento"
                    label="Departamento"
                    rules={[
                      {
                        required: state.type === 'Ticket' ? false : true,
                        message: 'Departamento es requerido',
                      },
                    ]}
                  >
                    <Input maxLength={30} />
                  </Form.Item>
                  {state.type === 'Exportación' && <SelectPais />}
                  {state.type === 'Exportación' && (
                    <Form.Item
                      name="NIFE"
                      label="NIFE"
                      rules={[
                        {
                          max: 20,
                          message: 'NIFE no puede tener más de 20 caracteres',
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  )}
                  {state.type === 'Factura' && (
                    <Form.Item
                      name="rut"
                      label="RUT"
                      rules={[
                        { required: true, message: 'RUT es requerido' },
                        {
                          pattern: rutRegex,
                          message: 'Ingrese un RUT Válido',
                          len: 12,
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  )}
                  {(state.type === 'Resguardo' || state.type === 'Ticket') && (
                    <Form.Item
                      noStyle
                      shouldUpdate={(prev, curr) =>
                        prev.documentType !== curr.documentType
                      }
                    >
                      {({ getFieldValue }) => {
                        return getFieldValue('documentType') === 'RUT' ? (
                          <Form.Item
                            name="rut"
                            label="RUT"
                            rules={[
                              { required: true, message: 'RUT es requerido' },
                              {
                                pattern: rutRegex,
                                message: 'Ingrese un RUT Válido',
                                len: 12,
                              },
                            ]}
                          >
                            <Input addonBefore={rutOCiSelector} />
                          </Form.Item>
                        ) : (
                          <Form.Item
                            name="cedula"
                            label="Cédula"
                            rules={[
                              {
                                pattern: ciRegex,
                                message:
                                  'Ingrese una Cédula Válida ej: 4.283.298-4',
                              },
                            ]}
                          >
                            <Input
                              addonBefore={rutOCiSelector}
                              placeholder="ej: 4.283.298-4"
                            />
                          </Form.Item>
                        );
                      }}
                    </Form.Item>
                  )}
                </Col>
                <Col xl={12} sm={24}>
                  <Form.Item
                    name="tipo"
                    label="Tipo"
                    rules={[{ required: true, message: 'Tipo es requerido' }]}
                  >
                    <Select>
                      {remaining.map((r, i) => (
                        <Option key={r.CFE} value={i}>
                          {r.tipo}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                  {(state.isNC || state.type === 'Resguardo') && (
                    <Form.Item
                      noStyle
                      shouldUpdate={(prev, curr) =>
                        prev.referenciaType !== curr.referenciaType
                      }
                    >
                      {({ getFieldValue }) => {
                        return getFieldValue('referenciaType') ===
                          'Referencia' ? (
                          <Form.Item
                            name="referencia"
                            label="Referencia"
                            rules={[
                              {
                                required: true,
                                message: 'Referencia es requerido',
                              },
                              {
                                pattern: onlyNumbersRegex,
                                validator: (rule, value) =>
                                  Number(value) < 9999999
                                    ? Promise.resolve()
                                    : Promise.reject(
                                        'Numero tiene que ser menor que 9.999.999'
                                      ),
                                message: 'Debe incluir solo Números',
                              },
                            ]}
                          >
                            <Input
                              addonBefore={resguardoOCiSelector}
                              type="number"
                              maxLength={7}
                            />
                          </Form.Item>
                        ) : (
                          <Form.Item
                            name="motivo"
                            label="Motivo"
                            rules={[
                              {
                                required: true,
                                message: 'Motivo es requerido',
                              },
                            ]}
                          >
                            <Input
                              addonBefore={resguardoOCiSelector}
                              type="text"
                            />
                          </Form.Item>
                        );
                      }}
                    </Form.Item>
                  )}
                  <Form.Item
                    name="fecha"
                    label="Fecha"
                    rules={[{ required: true, message: 'Fecha es requerido' }]}
                  >
                    <DatePicker
                      locale={datepickerLocale}
                      disabledDate={dateChecks}
                      format="DD/MM/YYYY"
                    />
                  </Form.Item>
                  <Form.Item label="Numero">
                    <Input.Group compact>
                      <Form.Item noStyle name="serie">
                        <Input disabled style={{ width: '20%' }} />
                      </Form.Item>
                      <Form.Item noStyle name="numero">
                        <InputRight disabled style={{ width: '80%' }} />
                      </Form.Item>
                    </Input.Group>
                  </Form.Item>
                  {state.type !== 'Resguardo' && (
                    <>
                      <Form.Item name="formaPago" label="Forma de Pago">
                        <Select>
                          <Option value="contado">Contado</Option>
                          <Option value="crédito">Crédito</Option>
                        </Select>
                      </Form.Item>
                      <Form.Item name="impuestos" label="Ingresar Precios">
                        <Select>
                          <Option value="+ IVA">+ IVA</Option>
                          <Option value="IVA INC">IVA INC</Option>
                        </Select>
                      </Form.Item>
                    </>
                  )}
                </Col>
              </Row>
            </Section>
            <Section>
              {state.type !== 'Resguardo' ? (
                <FormLines>
                  <Form
                    size="large"
                    layout="vertical"
                    name="lines"
                    form={lineas}
                    initialValues={{ lineas: [{}] }}
                    hideRequiredMark
                  >
                    <Form.List name="lineas">
                      {(fields, { add, remove }) => {
                        return (
                          <>
                            {fields.map((field, index) => (
                              <Row key={field.key}>
                                <Col xs={24} md={4}>
                                  <SmallFormItem
                                    className="first"
                                    label={index === 0 ? 'Cantidad' : undefined}
                                    name={[field.name, 'cantidad']}
                                  >
                                    <InputRight
                                      placeholder="Cantidad"
                                      type="number"
                                      addonBefore={
                                        <ClickableIcon
                                          title="Eliminar"
                                          type="danger"
                                          onClick={() =>
                                            index > 0 && remove(index)
                                          }
                                        >
                                          <DeleteOutlined />
                                        </ClickableIcon>
                                      }
                                    />
                                  </SmallFormItem>
                                </Col>
                                <Col flex={1} xs={24} md={10}>
                                  <SmallFormItem
                                    label={index === 0 ? 'Detalle' : undefined}
                                    name={[field.name, 'detalle']}
                                    rules={[
                                      {
                                        required: true,
                                        message: 'Detalle es requerido',
                                      },
                                    ]}
                                  >
                                    <Input placeholder="Detalle" />
                                  </SmallFormItem>
                                </Col>
                                <Col xs={24} span={6} md={5}>
                                  <SmallFormItem
                                    label={
                                      index === 0
                                        ? 'Precio Unitario'
                                        : undefined
                                    }
                                    name={[field.name, 'precio']}
                                    rules={[
                                      {
                                        required: true,
                                        message: 'Precio unitario es requerido',
                                      },
                                    ]}
                                  >
                                    <InputRight
                                      placeholder="Precio Unitario"
                                      type="number"
                                      onKeyDown={handleKeydownEvent}
                                    />
                                  </SmallFormItem>
                                </Col>
                                <Col xs={24} md={5}>
                                  <SmallFormItem
                                    className="last"
                                    label={index === 0 ? 'Total' : undefined}
                                    name={[field.name, 'total']}
                                  >
                                    <InputRight disabled placeholder="Total" />
                                  </SmallFormItem>
                                </Col>
                              </Row>
                            ))}
                            <Form.Item>
                              <Button type="default" onClick={add} block>
                                <PlusOutlined />
                                Agregar Línea
                              </Button>
                            </Form.Item>
                          </>
                        );
                      }}
                    </Form.List>
                  </Form>
                </FormLines>
              ) : (
                <Form
                  size="large"
                  layout="horizontal"
                  name="resguardo"
                  form={resguardo}
                  labelAlign="left"
                  {...formItemLayout}
                  initialValues={{
                    moneda: moneda === 'Dólares' ? 'USD' : 'UYU',
                  }}
                  hideRequiredMark
                >
                  <Typography>
                    <Typography.Title level={4}>Retención</Typography.Title>
                  </Typography>
                  <Row justify="space-between" gutter={32}>
                    <Col xl={12} sm={24}>
                      <Form.Item
                        name="codRetencion"
                        label="Código de retención"
                        rules={[
                          {
                            required: true,
                            message: 'Código de retención es requerido',
                          },
                          {
                            pattern: codRetencionRegex,
                            message:
                              'Código de retención es un número de 7 dígitos',
                          },
                        ]}
                      >
                        <InputRight maxLength={7} />
                      </Form.Item>
                      <Form.Item
                        name="tasa"
                        label="Tasa"
                        rules={[
                          {
                            required: true,
                            message: 'Tasa es requerido',
                          },
                          {
                            validator: (rule, value) => {
                              const number = Number(value);
                              if (number < 100 && number > 0) {
                                return Promise.resolve();
                              }
                              return Promise.reject(
                                'Tasa tiene que ser mayor a 0 y menor que 100'
                              );
                            },
                          },
                        ]}
                      >
                        <InputRight type="number" addonBefore="%" />
                      </Form.Item>
                    </Col>
                    <Col xl={12} sm={24}>
                      <Form.Item
                        name="montoImponible"
                        label="Monto Imponible"
                        rules={[
                          {
                            required: true,
                            message: 'Monto Imponible es requerido',
                          },
                          {
                            validator: (rule, value) => {
                              const number = Number(value);
                              if (number > 0) {
                                return Promise.resolve();
                              }
                              return Promise.reject(
                                'Monto imponible tiene que ser mayor a 0'
                              );
                            },
                          },
                        ]}
                      >
                        <InputRight
                          type="number"
                          addonBefore={<SelectCurrency />}
                        />
                      </Form.Item>
                      <Form.Item
                        label="Monto Retenido"
                        shouldUpdate={(prev, curr) =>
                          prev.montoImponible !== curr.montoImponible ||
                          prev.tasa !== curr.tasa
                        }
                      >
                        {({ getFieldValue }) => {
                          const imponible =
                            getFieldValue('montoImponible') || 0;
                          const tasa = getFieldValue('tasa') || 0;
                          const montoRetenido = imponible * (tasa / 100);
                          return (
                            <InputRight
                              value={formatImporte(montoRetenido)}
                              disabled
                            />
                          );
                        }}
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              )}
            </Section>
            <Section>
              <Row justify="space-between">
                <Col xl={12} sm={24}>
                  <Form.Item name="observaciones" label="Observaciones">
                    <TextArea autoSize={{ minRows: 4 }} />
                  </Form.Item>
                  {state.type !== 'Resguardo' && state.type !== 'Exportación' && (
                    <Form.Item name="ordenCompra" label="Orden de compra">
                      <Input />
                    </Form.Item>
                  )}
                  {state.type === 'Exportación' && (
                    <div>
                      <SelectCondVenta />
                      <SelectModVenta />
                      <SelectTransporte />
                    </div>
                  )}
                </Col>
                <Col xl={8} sm={24}>
                  {state.type !== 'Resguardo' ? (
                    <>
                      <Form.Item label="Subtotal">
                        <InputRight
                          disabled
                          value={formatImporte(totales?.subtotal)}
                        />
                      </Form.Item>
                      <Form.Item label="Descuento">
                        <Input.Group compact>
                          <Form.Item name="descuento" noStyle>
                            <InputRight prefix="%" style={{ width: '40%' }} />
                          </Form.Item>
                          <Form.Item noStyle>
                            <InputRight
                              style={{ width: '60%' }}
                              disabled
                              value={formatImporte(totales?.descuentoTotal)}
                            />
                          </Form.Item>
                        </Input.Group>
                      </Form.Item>
                      <Form.Item label="Neto">
                        <InputRight
                          disabled
                          value={formatImporte(totales?.neto)}
                        />
                      </Form.Item>
                      <Form.Item label="IVA" name="ivaFormatted">
                        <InputRight
                          addonBefore={
                            <SelectIva
                              disabled={state.type === 'Exportación'}
                            />
                          }
                          disabled
                        />
                      </Form.Item>
                      <Form.Item label="Total">
                        <InputRight
                          disabled
                          addonBefore={
                            <SelectCurrency
                              disabled={state.type === 'Exportación'}
                            />
                          }
                          value={formatImporte(totales?.total)}
                        />
                      </Form.Item>
                    </>
                  ) : null}
                </Col>
              </Row>
              <Row justify="end">
                <Space size="large">
                  <Button onClick={history.goBack}>Cancelar</Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    onClick={lineas.submit}
                  >
                    Aceptar
                  </Button>
                </Space>
              </Row>
            </Section>
          </Form>
        ) : (
          <Result
            status="warning"
            title="No se encontró numeración disponible para emitir nuevos documentos."
            subTitle="Comuníquese con Infra Sistemas"
          />
        )}
      </Form.Provider>
    </Spin>
  );
};

interface ClickableIconProps {
  children: React.ReactNode;
  onClick: () => void;
  type: 'primary' | 'danger';
  title: string;
}
const ClickableIcon = ({
  children,
  type,
  onClick,
  title,
}: ClickableIconProps) => {
  return (
    <Tooltip title={title}>
      <Container type={type} onClick={onClick}>
        {children}
      </Container>
    </Tooltip>
  );
};
const Container = styled.div<{ type: 'primary' | 'danger' }>`
  cursor: pointer;
  :hover {
    color: ${({ type }) => (type === 'primary' ? '#0851a1' : '#f5222d')};
  }
`;
interface WidthProps {
  width: string | number;
}

const InputRight = styled(Input)`
  text-align: right !important;
`;

const SmallFormItem = styled(Form.Item)`
  margin-bottom: 8px;
`;

export const Section = styled.div`
  padding: 16px;
  margin-bottom: 16px;
  border-radius: 4px;
  background-color: white;

  .ant-input-disabled {
    color: rgba(0, 0, 0, 0.65) !important;
  }

  @media (max-width: 720px) {
    .ant-form-item {
      margin-bottom: 4px;
    }

    label {
      height: unset !important;
    }
  }
`;

export const FormLines = styled.div`
  .ant-form {
    border-radius: 4px;
    input {
      border-radius: 0;
    }
  }
  .ant-col {
    &:first-child {
      .ant-form-item-label {
        border-top-left-radius: 4px;
      }
    }
    &:last-child {
      .ant-form-item-label {
        border-top-right-radius: 4px;
      }
      .ant-form-item-control {
        input {
          border-top-left-radius: 4px;
          border-top-right-radius: 4px;
        }
      }
    }
    .ant-form-item-label {
      background-color: rgba(8, 81, 161, 0.9) !important;
      text-align: center;
      padding-bottom: 0;
      margin-bottom: 4px;
      label {
        color: white;
        font-weight: bold;
      }
    }
  }
`;
