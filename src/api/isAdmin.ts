import { post, WebService } from './utils';

export const isAdmin = async (password: string) => {
  const url =
    'https://infrasistemas.sytes.net:7080/WebService.asmx?op=Es_Administrador';

  const sr = `<?xml version="1.0" encoding="utf-8"?>
    <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
      <soap12:Body>
        <Es_Administrador xmlns="http://infrasistemas.sytes.net:7080/">
          <Contraseña>${password}</Contraseña>
        </Es_Administrador>
      </soap12:Body>
    </soap12:Envelope>`;

  const isAdminWS: WebService<boolean> = {
    url,
    name: 'Es_Administrador',
    resultSelector: 'Es_AdministradorResult',
    sr,
    transform: (response: string): boolean => response === 'Sí',
  };
  return post(isAdminWS);
};
