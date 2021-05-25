import { transformDate } from 'utils';
import { tipoCFE, WSError } from './utils';
import Axios from 'axios';

export interface Remaining {
  tipo: string;
  CFE: number;
  desde: number;
  hasta: number;
  vence: string;
  utilizados: number;
  quedan: number;
  serie: string;
}

export const getRestantes = async (rut: string) => {
  const url = `https://infrasistemas.sytes.net:7080/api/caes/${rut}`;
  const { data } = await Axios.get(url, {
    timeout: 5000,
    responseType: 'json',
  }).catch((error) => {
    throw new WSError('caes');
  });

  return data.map((obj: any) => {
    const newObj: Remaining = {
      tipo: tipoCFE(obj.CAETCFE),
      CFE: obj.CAETCFE,
      desde: obj.CAEDNro,
      hasta: obj.CAEHNro,
      vence: transformDate(obj.CAEFVD),
      utilizados: obj.Utilizados,
      quedan: obj.Quedan,
      serie: obj.CAESerie,
    };
    return newObj;
  });
};
