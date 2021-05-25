import { post, WebService } from './utils';

export const getTopeClientes = async (rut: string) => {
  const url =
    'https://infrasistemas.sytes.net:7080/WebService.asmx?op=Tope_Clientes';

  const sr = `<?xml version="1.0" encoding="utf-8"?>
  <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
      <Tope_Clientes xmlns="http://infrasistemas.sytes.net:7080/">
        <RUT>${rut}</RUT>
      </Tope_Clientes>
    </soap:Body>
  </soap:Envelope>`;

  const getTopeClientesWS: WebService<number> = {
    url,
    name: 'Tope_Clientes',
    resultSelector: 'Tope_ClientesResult',
    sr,
    transform: (response: string) => Number(response),
  };
  return post(getTopeClientesWS);
};
