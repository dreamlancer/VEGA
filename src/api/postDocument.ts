import { FormattedDocument, FormattedLinea } from './formatDocument';
import { post, WebService } from './utils';

export const postHeader = async (doc: FormattedDocument) => {
  const url =
    'https://infrasistemas.sytes.net:7080/WebService.asmx?op=Recibo_Datos';

  const sr = `<?xml version="1.0" encoding="utf-8"?>
    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
    <Recibo_Datos xmlns="http://infrasistemas.sytes.net:7080/">
    <JSON>${JSON.stringify(doc)}</JSON>
    </Recibo_Datos>
  </soap:Body>
</soap:Envelope>`;

  const postHeaderWS: WebService<number | string> = {
    url,
    name: 'Recibo_Datos',
    resultSelector: 'Recibo_DatosResult',
    sr,
    transform: (response: string) => {
      const parsed = Number(response);
      return Number.isNaN(parsed) ? response : parsed;
    },
  };
  return post(postHeaderWS);
};

export const postLineas = async (lineas: any) => {
  const url =
    'https://infrasistemas.sytes.net:7080/WebService.asmx?op=Recibo_Datos_Lineas';

  const sr = `<?xml version="1.0" encoding="utf-8"?>
    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
      <soap:Body>
        <Recibo_Datos_Lineas xmlns="http://infrasistemas.sytes.net:7080/">
          <JSON>${JSON.stringify(lineas)}</JSON>
        </Recibo_Datos_Lineas>
      </soap:Body>
    </soap:Envelope>`;

  const postLineasWS: WebService<string> = {
    url,
    name: 'Recibo_Datos_Lineas',
    resultSelector: 'Recibo_Datos_LineasResult',
    sr,
    transform: (response: string) => response,
  };
  return post(postLineasWS);
};

export const validar = async (rut: string, id: number) => {
  const url = `https://infrasistemas.sytes.net:7080/WebService.asmx?op=Validador`;

  const sr = `<?xml version="1.0" encoding="utf-8"?>
    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
      <soap:Body>
        <Validador xmlns="http://infrasistemas.sytes.net:7080/">
          <RUT>${rut}</RUT>
          <CabId>${id}</CabId>
        </Validador>
      </soap:Body>
    </soap:Envelope>`;

  const validarWS: WebService<string> = {
    url,
    name: 'Validador',
    resultSelector: 'ValidadorResult',
    sr,
    transform: (response: string) => response,
  };
  return post(validarWS);
};
