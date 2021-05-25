import { post, WebService } from './utils';

export const isAccountant = async (rut: string, password: string) => {
  const url =
    'https://infrasistemas.sytes.net:7080/WebService.asmx?op=Es_Contador';

  const sr = `<?xml version="1.0" encoding="utf-8"?>
    <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
      <soap12:Body>
        <Es_Contador xmlns="http://infrasistemas.sytes.net:7080/">
          <RUT>${rut}</RUT>
          <Contraseña>${password}</Contraseña>
        </Es_Contador>
      </soap12:Body>
    </soap12:Envelope>`;

  const isAccountantWS: WebService<boolean> = {
    url,
    name: 'Es_Contador',
    resultSelector: 'Es_ContadorResult',
    sr,
    transform: (response: string): boolean => response === 'Sí',
  };
  return post(isAccountantWS);
};
