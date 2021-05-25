import { post, WebService } from './utils';

export const login = async (user: string, pass: string) => {
  const url =
    'https://infrasistemas.sytes.net:7080/WebService.asmx?op=ValidarRUT';

  const sr = `<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><ValidarRUT xmlns="http://infrasistemas.sytes.net:7080/"><RUT>${user}</RUT><Contraseña>${pass}</Contraseña></ValidarRUT></soap:Body></soap:Envelope>`;

  const loginWS: WebService<string> = {
    url,
    name: 'ValidarRUT',
    resultSelector: 'ValidarRUTResult',
    sr,
    transform: (s) => s,
  };
  return post(loginWS);
};
