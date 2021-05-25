import { post, WebService } from './utils';

export const getCertificate = async (rut: string) => {
  const url =
    'https://infrasistemas.sytes.net:7080/WebService.asmx?op=Certificado';

  const sr = `<?xml version="1.0" encoding="utf-8"?>
    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
      <soap:Body>
        <Certificado xmlns="http://infrasistemas.sytes.net:7080/">
          <RUT>${rut}</RUT>
        </Certificado>
      </soap:Body>
    </soap:Envelope>`;

  const getCertificateWS: WebService<string> = {
    url,
    name: 'Certificado',
    resultSelector: 'CertificadoResult',
    sr,
    transform: (response: string) => response,
  };
  return post(getCertificateWS);
};
