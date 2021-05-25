import { post, WebService } from './utils';

export const changePass = async (rut: string, pass: string) => {
  const url =
    'https://infrasistemas.sytes.net:7080/WebService.asmx?op=Cambio_Pwd';

  const sr = `<?xml version="1.0" encoding="utf-8"?>
    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
      <soap:Body>
        <Cambio_Pwd xmlns="http://infrasistemas.sytes.net:7080/">
          <RUT>${rut}</RUT>
          <Contraseña>${pass}</Contraseña>
        </Cambio_Pwd>
      </soap:Body>
    </soap:Envelope>`;

  const changePassWS: WebService<number> = {
    url,
    name: 'Cambio_Pwd',
    resultSelector: 'Cambio_PwdResult',
    sr,
    transform: (response: string) => Number(response),
  };
  return post(changePassWS);
};
