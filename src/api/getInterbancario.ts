import { post, WebService } from './utils';

export const getInterbancario = async () => {
  const url =
    'https://infrasistemas.sytes.net:7080/WebService.asmx?op=Interbancario';

  const sr = `<?xml version="1.0" encoding="utf-8"?>
    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
      <soap:Body>
        <Interbancario xmlns="http://infrasistemas.sytes.net:7080/" />
      </soap:Body>
    </soap:Envelope>`;

  const getInterbancarioWS: WebService<number> = {
    url,
    name: 'Interbancario',
    resultSelector: 'InterbancarioResult',
    sr,
    transform: (response: string) => Number(response),
  };
  return post(getInterbancarioWS);
};
