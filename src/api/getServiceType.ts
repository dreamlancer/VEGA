import { post, WebService } from './utils';

export const getServiceType = async (rut: string) => {
  const url =
    'https://infrasistemas.sytes.net:7080/WebService.asmx?op=Servicio_Contratado';

  const sr = `<?xml version="1.0" encoding="utf-8"?>
  <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
      <Servicio_Contratado xmlns="http://infrasistemas.sytes.net:7080/">
        <RUT>${rut}</RUT>
      </Servicio_Contratado>
    </soap:Body>
  </soap:Envelope>`;

  const getServicioContratadoWS: WebService<string> = {
    url,
    name: 'Servicio_Contratado',
    resultSelector: 'Servicio_ContratadoResult',
    sr,
    transform: (res) => res,
  };
  return post(getServicioContratadoWS);
};
