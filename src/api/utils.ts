import axios from 'axios';
import { Document } from './getDocuments';
import { ImpresionType } from './preferences';

export const parseXML = async (raw: string) => {
  const parser = new DOMParser();
  return parser.parseFromString(raw, 'text/xml');
};

export interface WebService<T> {
  url: string;
  sr: string;
  resultSelector: string;
  errorSelector?: string;
  name: string;
  transform: (result: string) => T;
}

export class WSError extends Error {
  name: string;
  constructor(name: string, message?: string) {
    super(message);
    this.name = name;
  }
}

const errorTypes = {
  parse: 'Código: P10',
  timeout: 'Código: T10',
};

export const post = async <T extends {}>({
  url,
  sr,
  resultSelector,
  errorSelector,
  name,
  transform,
}: WebService<T>): Promise<T> => {
  return axios
    .post(url, sr, {
      headers: {
        'Content-Type': 'text/xml; charset="utf-8"',
      },
      timeout: 20 * 1000,
    })
    .then(async ({ data }) => {
      const rr = await parseXML(data);
      const p = rr.querySelector(resultSelector)?.textContent;
      if (!p) {
        throw new Error(errorTypes.parse);
      }
      return transform(String(p));
    })
    .catch((error: Error) => {
      const isTimeout = !!error?.message?.match(/timeout/);
      throw new WSError(name, isTimeout ? errorTypes.timeout : error.message);
    });
};

export const getDocumentsURL = (
  rut: string,
  isAdmin: boolean,
  isAccountant: boolean
) =>
  encodeURI(
    `https://infrasistemas.sytes.net:7080/api/Ultimos_Documentos/${rut},${
      isAdmin ? 'Sí' : 'No'
    },${isAccountant ? 'Sí' : 'No'}/`
  );

export const getAllDocumentsURL = (
  rut: string,
  isAccountant: boolean,
  desde: string,
  hasta: string
) =>
  encodeURI(
    `https://infrasistemas.sytes.net:7080/api/Documentos/${rut},${
      isAccountant ? 'Sí' : 'No'
    },${desde},${hasta}/`
  );

export const getComprasURL = (
  rut: string,
  isAdmin: boolean,
  isAccountant: boolean
) =>
  encodeURI(
    `https://infrasistemas.sytes.net:7080/api/Ultimos_Documentos_Externos/${rut},${
      isAdmin ? 'Sí' : 'No'
    },${isAccountant ? 'Sí' : 'No'}/`
  );

export const getAllComprasURL = (
  rut: string,
  isAccountant: boolean,
  desde: string,
  hasta: string
) =>
  encodeURI(
    `https://infrasistemas.sytes.net:7080/api/Documentos_Externos/${rut},${
      isAccountant ? 'Sí' : 'No'
    },${desde},${hasta}/`
  );

export const tipoCFE = (rawCfe: number) => {
  switch (rawCfe) {
    case 101:
      return 'e-Ticket';
    case 102:
      return 'NC e-Ticket';
    case 103:
      return 'ND e-Ticket';
    case 111:
      return 'e-Factura';
    case 112:
      return 'NC e-Factura';
    case 113:
      return 'ND e-Factura';
    case 121:
      return 'Exportación';
    case 122:
      return 'NC Exportación';
    case 123:
      return 'ND e-Factura';
    case 124:
      return 'e-Remito';
    case 131:
      return 'e-Ticket';
    case 132:
      return 'NC e-Ticket';
    case 133:
      return 'ND e-Ticket';
    case 141:
      return 'e-Factura';
    case 142:
      return 'NC e-Factura';
    case 143:
      return 'ND e-Factura';
    case 151:
      return 'e-Boleta';
    case 152:
      return 'NC e-Boleta';
    case 153:
      return 'ND e-Boleta';
    case 181:
      return 'e-Remito';
    case 182:
      return 'e-Resguardo';
    case 201:
      return 'e-Ticket';
    case 202:
      return 'NC e-Ticket';
    case 203:
      return 'ND e-Ticket';
    case 211:
      return 'e-Factura';
    case 212:
      return 'NC e-Factura';
    case 213:
      return 'ND e-Factura';
    case 221:
      return 'e-Factura';
    case 222:
      return 'NC e-Factura';
    case 223:
      return 'ND e-Factura';
    case 224:
      return 'e-Remito';
    case 231:
      return 'e-Ticket';
    case 232:
      return 'NC e-Ticket';
    case 233:
      return 'ND e-Ticket';
    case 241:
      return 'e-Factura';
    case 242:
      return 'NC e-Factura';
    case 243:
      return 'ND e-Factura';
    case 251:
      return 'e-Boleta';
    case 252:
      return 'NC e-Boleta';
    case 253:
      return 'ND e-Boleta';
    case 281:
      return 'e-Remito';
    case 282:
      return 'e-Resguardo';
    default:
      return '';
  }
};

export const tipoMoneda = (rawMoneda: string) => {
  if (rawMoneda === 'UYU') {
    return 'Pesos';
  }
  return 'Dólares';
};

export const tipoPago = (rawTipo: number) => {
  if (rawTipo === 1) {
    return 'Contado';
  }
  return 'Crédito';
};

export const transformDateYYYMMDD = (rawDate: any) => {
  const myDate = new Date(rawDate.match(/\d+/)[0] * 1);
  return (
    myDate.getFullYear() +
    `0${myDate.getMonth() + 1}`.slice(-2) +
    `0${myDate.getDate()}`.slice(-2)
  );
};

export const transformDateTime = (rawDate: any) => {
  const myDate = new Date(rawDate.match(/\d+/)[0] * 1);
  return (
    myDate.getTime()
  );
};

export const tipoEstado = (rawEstado: string) => {
  switch (rawEstado) {
    case 'ER':
    case 'BE':
      return 'Rechazado';
    case 'PE':
    case 'FS':
    case 'PS':
    case 'CT':
      return 'En espera';
    case 'AE':
    case '':
      return 'Aceptado';
    default:
      return 'Error';
  }
};

export const buildPDF = (
  rut: string,
  printType: ImpresionType,
  payload: Document['pdfPayload']
) => {
  let encodedUrl, encodedHash;
  if(printType === 'A4') {
    encodedUrl = encodeURI(
      `https://infrasistemas.sytes.net:7080/WebService.asmx/Ver_PDF?RUT=${rut}&FECabId=${payload.docId}&FEHash=`      
    );
    encodedHash = `${
      payload.hash ? `${encodeURIComponent(payload.hash)}` : ''
    }`;
  } else {
    encodedUrl = encodeURI(
      `https://infrasistemas.sytes.net:7081/FacturacionElectronica${
        // eslint-disable-next-line eqeqeq
        rut == '219999820013' ? 'test' : 'multi'
      }/arcomprobantecfeetiquetadoraimpresora.aspx?${payload.id},${payload.fecha},${payload.docId},${payload.docId}.pdf`
    );
    encodedHash = `${
      payload.hash ? `,${encodeURIComponent(payload.hash)}` : ''
    }`;
  }

  return `${encodedUrl}${encodedHash}`;
};

export const buildPDFCompras = (
  idEmpresa: any,
  fecha: any,
  idDocumento: any,
  name: any,
  hash: any
) => {
  const encodedUrl = encodeURI(
    `https://infrasistemas.sytes.net:7081/FacturacionElectronicamulti/arcomprobantecfe.aspx?${idEmpresa},${fecha},${idDocumento},${name}.pdf,`
  );
  const encodedHash = encodeURIComponent(hash);
  return `${encodedUrl}${encodedHash}`;
};
