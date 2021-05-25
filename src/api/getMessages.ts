import { post, WebService } from './utils';

type Severity = 'Alta' | 'Media' | 'Baja';

export interface Message {
  Mensaje: string;
  Severidad: Severity;
  Cerrable: boolean;
  Descripcion?: string;
}

export const getMessages = async (rut: string) => {
  const url =
    'https://infrasistemas.sytes.net:7080/WebService.asmx?op=Mensajes';

  const sr = `<?xml version="1.0" encoding="utf-8"?>
    <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
      <soap12:Body>
        <Mensajes xmlns="http://infrasistemas.sytes.net:7080/">
          <RUT>${rut}</RUT>
        </Mensajes>
      </soap12:Body>
    </soap12:Envelope>`;

  const getMessagesWS: WebService<Message[]> = {
    url,
    name: 'Mensajes',
    resultSelector: 'MensajesResult',
    sr,
    transform: (response: string) => JSON.parse(response),
  };
  return post(getMessagesWS);
};
