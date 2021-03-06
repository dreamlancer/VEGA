import { DocTypes } from './../components/DocumentForm/index';
import { Line } from '../components/DocumentForm';
/* eslint-disable @typescript-eslint/camelcase */
import { formatDecimal } from 'utils';
import { countries } from 'constants/countries';

export interface FormattedDocument {
  RutEmisor: string;
  Nombre: string;
  Direccion: string;
  Ciudad: string;
  Departamento: string;
  CI: string;
  Rut: number;
  Tipo: number;
  Serie: string;
  Numero: number;
  Fecha: string; // dd/MM/yyyy
  FormaPago: string;
  Observaciones?: string;
  TipoIva: Iva | '';
  Total: string;
  Moneda: string;
  Orden_Compra?: string;
  Interbancario: string;
  //   Lineas: any[];
  CantLineas: number;
  Referencia: string;
  Motivo: string;
  Subtotal: string; // Formatted Decimals Neto
  Iva: string;
}

export interface FormattedLinea {
  RutEmisor: string;
  Id: number;
  Linea: number; //Index
  Detalle: string;
  Cantidad: string; //Formatted Decimals
  Precio: string; // Formatted Decimals
  Importe: string; //Formatted Decimals
  IVA: Iva | '';
}

type Iva = '22%' | '10%' | '0%' | '0% E' | 'eBoleta';

const transformIva = (iva: number, type: string): Iva | '' => {
  if(type === 'Remito') return 'eBoleta';
  switch (iva) {
    case 1.0:
      return type === 'Exportación' ? '0% E' : '0%';
    case 1.1:
      return '10%';
    case 1.22:
      return '22%';
    default:
      return '';
  }
};

export const formatLineas = (
  lineas: Line[],
  formattedDocument: FormattedDocument,
  id: number,
  doc: any
): FormattedLinea[] =>
  lineas.map((line, index) => {
    const number_cantidad = (Number(line.cantidad?line.cantidad.toString().replace(',', '.'):'0') );
    const number_precio = (Number(line.precio?line.precio.toString().replace(',', '.'):'0'));
    const cantidad = number_cantidad || 1;
    const { impuestos, tipoIva } = doc;
    const ivaInc = impuestos === 'IVA INC';
    
    const precio = ivaInc ? number_precio / tipoIva : number_precio;
    return {
      RutEmisor: formattedDocument.RutEmisor,
      Cantidad: formatDecimal(cantidad, 4),
      Detalle: String(line.detalle),
      Id: id,
      Linea: index,
      Precio: formatDecimal(precio, 4),
      Importe: formatDecimal(cantidad * precio, 4),
      IVA: formattedDocument.TipoIva,
    };
  });

export const formatLineasResguardo = (
  resguardo: any,
  formattedDocument: FormattedDocument,
  id: number
) => [
  {
    RutEmisor: formattedDocument.RutEmisor,
    Linea: 0,
    IVA: '',
    Tipo: 182,
    Id: id,
    Detalle: resguardo.codRetencion,
    Precio: '0',
    Importe: '0',
    Cantidad: '0',
    Tasa: formatDecimal(resguardo.tasa),
    MntSujetoaRet: formatDecimal(resguardo.montoImponible),
    ValRetPerc: formatDecimal(
      resguardo.montoImponible * (resguardo.tasa / 100)
    ),
  },
];

export const formatDocument = (
  doc: any,
  rut: string,
  interbancario: number,
  type: DocTypes
): FormattedDocument =>
  Object.assign(EmptyFormattedDoducment, {
    RutEmisor: String(rut),
    Nombre: doc.nombre || '',
    Direccion: doc.direccion || '',
    Ciudad: doc.ciudad || '',
    Departamento: doc.departamento || '',
    CI: doc.cedula || '',
    Rut: doc.rut || '',
    Tipo: doc.cfe,
    Serie: doc.serie,
    Numero: doc.numero,
    Fecha: (doc.fecha as moment.Moment).format('DD/MM/yyyy'),
    FormaPago: doc.formaPago,
    Interbancario: formatDecimal(interbancario),
    CantLineas: doc.lineas?.length || 1,
    Iva: doc.iva ? formatDecimal(doc.iva) : '0',
    Referencia: doc.referencia ? doc.referencia : doc.motivo,
    Orden_Compra: doc.ordenCompra || '',
    Moneda: doc.moneda,
    Subtotal: doc.neto ? formatDecimal(doc.neto) : '0',
    TipoIva: transformIva(doc.tipoIva, type),
    Total: doc.total ? formatDecimal(doc.total) : '0',
    Observaciones: doc.observaciones,
    Descuento: formatDecimal(doc.descuento),
    Descuento_Importe: formatDecimal(doc.descuentoTotal),
    NIFE: doc.NIFE,
    País: countries.find((c) => c.code === doc.pais)?.label.trim(),
    Código_País: doc.pais,
    FEIDDocClauVenta: doc.condicionVenta,
    FEIDDocModVenta: doc.modalidadVenta
      ? Number(doc.modalidadVenta)
      : undefined,
    FEIDDocViaTransp: doc.transporte ? Number(doc.transporte) : undefined,
    TipoRemito: doc.TipoRemito || '',
  });

const EmptyFormattedDoducment = {
  RutEmisor: 0,
  Nombre: '',
  Direccion: '',
  Ciudad: '',
  Departamento: '',
  CI: '',
  Tipo: null,
  CantLineas: 1,
  Fecha: null,
  FormaPago: '',
  Interbancario: null,
  Iva: 0,
  Moneda: 'UYU',
  Numero: 0,
  Referencia: '',
  Motivo: '',
  Rut: '',
  Serie: '',
  Subtotal: 0,
  TipoIva: '22%',
  Total: 0,
  Observaciones: '',
  Orden_Compra: '',
};
