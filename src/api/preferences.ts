import { WebService, post } from './utils';

const urlGetMoneda =
  'https://infrasistemas.sytes.net:7080/WebService.asmx?op=Moneda_Preferencial';
const urlPostMoneda =
  'https://infrasistemas.sytes.net:7080/WebService.asmx?op=Cambiar_Moneda_Preferencial';
const urlGetImpuestos =
  'https://infrasistemas.sytes.net:7080/WebService.asmx?op=Impuestos_Preferencial';
const urlPostImpuestos =
  'https://infrasistemas.sytes.net:7080/WebService.asmx?op=Cambiar_Impuestos_Preferencial';
const urlGetImpresion =
  'https://infrasistemas.sytes.net:7080/WebService.asmx?op=Tipo_Impresi%c3%b3n';
const urlPostImpresion =
  'https://infrasistemas.sytes.net:7080/WebService.asmx?op=Cambio_Tipo_Impresi%c3%b3n';

export const getMoneda = async (rut: string) => {
  const sr = `<?xml version="1.0" encoding="utf-8"?>
    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
      <soap:Body>
      <Moneda_Preferencial xmlns="http://infrasistemas.sytes.net:7080/">
      <RUT>${rut}</RUT>
    </Moneda_Preferencial>
      </soap:Body>
    </soap:Envelope>`;

  const getMonedaWS: WebService<string> = {
    url: urlGetMoneda,
    name: 'Moneda_Preferencial',
    resultSelector: 'Moneda_PreferencialResult',
    sr,
    transform: (res) => res,
  };

  return post(getMonedaWS);
};

export const postMoneda = async (rut: string, moneda: string) => {
  const sr = `<?xml version="1.0" encoding="utf-8"?>
    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
    <Cambio_Moneda_Preferencial xmlns="http://infrasistemas.sytes.net:7080/">
    <RUT>${rut}</RUT>
    <Moneda>${moneda}</Moneda>
    </Cambio_Moneda_Preferencial>
    </soap:Body>
    </soap:Envelope>`;

  const postMonedaWS: WebService<string> = {
    url: urlPostMoneda,
    name: 'Cambio_Moneda_Preferencial',
    resultSelector: 'Cambio_Moneda_PreferencialResult',
    sr,
    transform: (res) => res,
  };

  return post(postMonedaWS);
};

export const getImpuestos = async (rut: string) => {
  const sr = `<?xml version="1.0" encoding="utf-8"?>
    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
    <Impuestos_Preferencial xmlns="http://infrasistemas.sytes.net:7080/">
    <RUT>${rut}</RUT>
    </Impuestos_Preferencial>
    </soap:Body>
    </soap:Envelope>`;

  const getImpuestosWS: WebService<string> = {
    url: urlGetImpuestos,
    name: 'Impuestos_Preferencial',
    resultSelector: 'Impuestos_PreferencialResult',
    sr,
    transform: (res) => res,
  };

  return post(getImpuestosWS);
};

export const postImpuestos = async (rut: string, impuestos: string) => {
  const sr = `<?xml version="1.0" encoding="utf-8"?>
    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
    <Cambio_Impuestos_Preferencial xmlns="http://infrasistemas.sytes.net:7080/">
    <RUT>${rut}</RUT>
    <Impuestos>${impuestos}</Impuestos>
    </Cambio_Impuestos_Preferencial>
    </soap:Body>
    </soap:Envelope>`;

  const getImpuestosWS: WebService<string> = {
    url: urlPostImpuestos,
    name: 'Cambio_Impuestos_Preferencial',
    resultSelector: 'Cambio_Impuestos_PreferencialResult',
    sr,
    transform: (res) => res,
  };

  return post(getImpuestosWS);
};

export const getImpresion = async (rut: string) => {
  const sr = `<?xml version="1.0" encoding="utf-8"?>
  <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
      <Tipo_Impresión xmlns="http://infrasistemas.sytes.net:7080/">
        <RUT>${rut}</RUT>
      </Tipo_Impresión>
    </soap:Body>
  </soap:Envelope>`;

  const getImpresionWS: WebService<string> = {
    url: urlGetImpresion,
    name: 'Tipo_Impresión',
    resultSelector: 'Tipo_ImpresiónResult',
    sr,
    transform: (res) => res,
  };

  return post(getImpresionWS);
};

export type ImpresionType = 'A4' | 'Térmico';

export const postImpresion = async (rut: string, impresion: ImpresionType) => {
  const sr = `<?xml version="1.0" encoding="utf-8"?>
  <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
    <soap12:Body>
      <Cambio_Tipo_Impresión xmlns="http://infrasistemas.sytes.net:7080/">
        <RUT>${rut}</RUT>
        <Impresión>${impresion}</Impresión>
      </Cambio_Tipo_Impresión>
    </soap12:Body>
  </soap12:Envelope>`;

  const postImpresionWS: WebService<string> = {
    url: urlPostImpresion,
    name: 'Cambio_Tipo_Impresión',
    resultSelector: 'Cambio_Tipo_ImpresiónResult',
    sr,
    transform: (res) => res,
  };

  return post(postImpresionWS);
};
