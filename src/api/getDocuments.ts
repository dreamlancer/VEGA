import { WSError } from 'api/utils';
import {
  getDocumentsURL,
  tipoCFE,
  tipoMoneda,
  tipoPago,
  tipoEstado,
  getAllDocumentsURL,
  transformDateYYYMMDD,
} from './utils';
import { transformDate, formatImporte } from 'utils';
import Axios from 'axios';

export interface Document {
  estado: string;
  cfe: string;
  RawCfe: number;
  serie: string;
  numero: number;
  fecha: string;
  cliente: string;
  iva: string;
  subtotal: string;
  importe: string;
  moneda: string;
  tipoPago: string;
  pdf: string;
  disabled: boolean;
  pdfPayload: {
    id: number;
    fecha: string;
    docId: string;
    hash?: string;
  };
}

export const getDocuments = async (
  rut: string,
  id: number,
  isAdmin: boolean,
  isAccountant: boolean
) => {
  const { data } = await Axios.get(
    getDocumentsURL(rut, isAdmin, isAccountant),
    {
      timeout: 5000,
      responseType: 'json',
    }
  ).catch((error) => {
    throw new WSError('Ultimos_Documentos');
  });
  return formatDocument(data, id);
};

export const getAllDocuments = async (
  rut: string,
  id: number,
  isAccountant: boolean,
  desde: string,
  hasta: string
) => {
  const { data } = await Axios.get(
    getAllDocumentsURL(rut, isAccountant, desde, hasta),
    {
      timeout: 5000,
      responseType: 'json',
    }
  ).catch((error) => {
    throw new WSError('Ultimos_Documentos');
  });

  return formatDocument(data, id);
};

const formatDocument = (data: any[], id: number): Document[] =>
  data.map((item: any) => {
    let disabled = false;
    const estado = tipoEstado(item.FECabEstadoFactura);
    if (estado === 'Error' || estado === 'Rechazado') {
      disabled = true;
    }
    const newItem: Document = {
      estado,
      cfe: tipoCFE(item.FEIDDocTipoCFE),
      RawCfe: item.FEIDDocTipoCFE,
      serie: item.FEIDDocSerie,
      numero: item.FEIDDocNro,
      fecha: transformDate(item.FEIDDocFchEmis),
      cliente: item.FERECRznSocRecep,
      iva: formatImporte(item.IVA),
      subtotal: formatImporte(item.Subtotal),
      importe: formatImporte(item.FETOTMntPagar),
      moneda: tipoMoneda(item.FETOTTpoMoneda),
      tipoPago: tipoPago(item.FEIDDocFmaPago),
      pdfPayload: {
        id,
        fecha: transformDateYYYMMDD(item.FEFechaAlta),
        docId: item.FECabID,
        hash: item.FEHash,
      },
      pdf: '',
      disabled,
    };
    return newItem;
  });