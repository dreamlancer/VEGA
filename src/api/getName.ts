import { post, WebService } from './utils';

export const getName = async (rut: string) => {
  const url = `https://infrasistemas.sytes.net:7080/WebService.asmx?op=RazonSocial`;

  const sr = `<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><RazonSocial xmlns="http://infrasistemas.sytes.net:7080/"><RUT>${rut}</RUT></RazonSocial></soap:Body></soap:Envelope>`;

  const getNameWS: WebService<string> = {
    url,
    name: 'RazonSocial',
    resultSelector: 'RazonSocialResult',
    sr,
    transform: (response: string) => response,
  };
  return post(getNameWS);
};
