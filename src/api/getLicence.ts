import { post, WebService } from './utils';

export const getLicence = async (rut: string) => {
  const url =
    'https://infrasistemas.sytes.net:7080/WebService.asmx?op=LicenciaHasta';

  const sr = `<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><LicenciaHasta xmlns="http://infrasistemas.sytes.net:7080/"><RUT>${rut}</RUT></LicenciaHasta></soap:Body></soap:Envelope>`;

  const getLicenceWS: WebService<number> = {
    url,
    name: 'LicenciaHasta',
    resultSelector: 'LicenciaHastaResult',
    sr,
    transform: (response: string) => Number(response),
  };
  return post(getLicenceWS);
};
