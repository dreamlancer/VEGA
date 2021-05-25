import { post, WebService } from './utils';

export const canExport = async (rut: string, password: string) => {
  const url =
    'https://infrasistemas.sytes.net:7080/WebService.asmx?op=Puede_Exportar';

  const sr = `<?xml version="1.0" encoding="utf-8"?>
    <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
      <soap12:Body>
        <Puede_Exportar xmlns="http://infrasistemas.sytes.net:7080/">
          <RUT>${rut}</RUT>
          <Contraseña>${password}</Contraseña>
        </Puede_Exportar>
      </soap12:Body>
    </soap12:Envelope>`;

  const canExportWS: WebService<boolean> = {
    url,
    name: 'Puede_Exportar',
    resultSelector: 'Puede_ExportarResult',
    sr,
    transform: (response: string): boolean => response === 'Sí',
  };
  return post(canExportWS);
};
