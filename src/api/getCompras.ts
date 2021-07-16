import { Document } from './getDocuments';
import {
  tipoEstado,
  tipoCFE,
  tipoMoneda,
  tipoPago,
  buildPDFCompras,
  transformDateYYYMMDD,
  WSError,
  getAllComprasURL,
  transformDateTime,
} from './utils';
import { transformDate, formatImporte } from 'utils';
import Axios from 'axios';

export const getAllCompras = async (
  rut: string,
  id: number,
  isAccountant: boolean,
  desde: string,
  hasta: string
) => {
  const { data } = await Axios.get(
    getAllComprasURL(rut, isAccountant, desde, hasta),
    {
      timeout: 5000,
      responseType: 'json',
    }
  ).catch((error) => {
    throw new WSError('Documentos_Externos');
  });
  return formatDocument(data, id);
};

const formatDocument = (data: any[], id: number): Document[] =>
  data.map((item: any) => {
    let disabled = false;
    const estado = tipoEstado(item.FEEstadoEntreEmpresas.trim());
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
      cliente: item.FEProveedor,
      importe: formatImporte(item.FETOTMntPagar),
      iva: formatImporte(item.IVA),
      subtotal: formatImporte(item.Subtotal),
      moneda: tipoMoneda(item.FETOTTpoMoneda),
      tipoPago: tipoPago(item.FEIDDocFmaPago),
      pdf: buildPDFCompras(
        id,
        transformDateYYYMMDD(item.FEFechaAlta),
        item.FECabID,
        `${item.FEProveedor}-${item.FEIDDocNro}`,
        item.FEHash
      ),
      pdfPayload: {
        id: id,
        docId: item.FECabID,
        fecha: transformDateYYYMMDD(item.FEFechaAlta),
        fechaGetTime: transformDateTime(item.FEFechaAlta),
      },
      disabled,
    };
    return newItem;
  });
