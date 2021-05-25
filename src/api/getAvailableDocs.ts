import { post, WebService } from './utils';

export const getAvailableDocs = async (rut: string) => {
  const url =
    'https://infrasistemas.sytes.net:7080/WebService.asmx?op=Documentos_Disponibles';

  const sr = `<?xml version="1.0" encoding="utf-8"?>
  <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
    <soap12:Body>
      <Documentos_Disponibles xmlns="http://infrasistemas.sytes.net:7080/">
        <RUT>${rut}</RUT>
      </Documentos_Disponibles>
    </soap12:Body>
  </soap12:Envelope>`;

  const getAvailableDocsWS: WebService<string> = {
    url,
    name: 'Documentos_Disponibles',
    resultSelector: 'Documentos_DisponiblesResult',
    sr,
    transform: (response: string) => response,
  };
  return post(getAvailableDocsWS);
};
