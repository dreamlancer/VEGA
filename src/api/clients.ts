/* eslint-disable @typescript-eslint/camelcase */
import { post, WebService } from './utils';

const postClientUrl = `https://infrasistemas.sytes.net:7080/WebService.asmx?op=Recibo_Datos_Cliente`;

const getClientsURL = `https://infrasistemas.sytes.net:7080/WebService.asmx?op=Listado_Clientes`;

const deleteClientURL = `https://infrasistemas.sytes.net:7080/WebService.asmx?op=Elimino_Cliente`;

const modifyClientURL = `https://infrasistemas.sytes.net:7080/WebService.asmx?op=Modifico_Datos_Cliente`;

export interface Client {
  id?: number;
  nombre: string;
  direccion: string;
  ciudad: string;
  departamento: string;
  rut?: string;
  cedula?: string;
}

export interface SOAPClient {
  Id?: number;
  Nombre: string;
  Dirección: string;
  Ciudad: string;
  Departamento: string;
  RUT?: string;
  Cédula?: string;
}

export const transformClients = (response: string): Client[] =>
  JSON.parse(response).map((c: SOAPClient) => ({
    id: c.Id,
    nombre: c.Nombre,
    direccion: c.Dirección,
    ciudad: c.Ciudad,
    departamento: c.Departamento,
    rut: c.RUT,
    cedula: c.Cédula,
  }));

const transformClient = (rut: string, client: Client) => ({
  Cliente_Empresa: rut,
  Cliente_Id: client?.id,
  Cliente_Nombre: client.nombre,
  Cliente_Ciudad: client.ciudad,
  Cliente_Cédula: client.cedula,
  Cliente_Departamento: client.departamento,
  Cliente_Dirección: client.direccion,
  Cliente_RUT: client.rut,
});

export const postClient = async (rut: string, client: Client) => {
  const sr = `<?xml version="1.0" encoding="utf-8"?>
    <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
      <soap12:Body>
        <Recibo_Datos_Cliente xmlns="http://infrasistemas.sytes.net:7080/">
          <JSON>${JSON.stringify(transformClient(rut, client))}</JSON>
        </Recibo_Datos_Cliente>
      </soap12:Body>
    </soap12:Envelope>`;

  const postClienteWS: WebService<string> = {
    url: postClientUrl,
    name: 'Recibo_Datos_Cliente',
    resultSelector: 'Recibo_Datos_ClienteResult',
    sr,
    transform: (res) => res,
  };

  return post(postClienteWS);
};

export const getClients = async (rut: string) => {
  const sr = `<?xml version="1.0" encoding="utf-8"?>
  <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
      <Listado_Clientes xmlns="http://infrasistemas.sytes.net:7080/">
        <RUT>${rut}</RUT>
      </Listado_Clientes>
    </soap:Body>
  </soap:Envelope>`;

  const getClientes: WebService<Client[]> = {
    url: getClientsURL,
    name: 'Listado_Clientes',
    resultSelector: 'Listado_ClientesResult',
    sr,
    transform: transformClients,
  };

  return post(getClientes);
};

export const deleteClient = async (rut: string, id: number) => {
  const sr = `<?xml version="1.0" encoding="utf-8"?>
   <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
     <soap12:Body>
       <Elimino_Cliente xmlns="http://infrasistemas.sytes.net:7080/">
         <RUT>${rut}</RUT>
         <Id>${id}</Id>
       </Elimino_Cliente>
     </soap12:Body>
   </soap12:Envelope>`;

  const deleteCliente: WebService<string> = {
    url: deleteClientURL,
    name: 'Elimino_Cliente',
    resultSelector: 'Elimino_ClienteResult',
    sr,
    transform: (res) => res,
  };

  return post(deleteCliente);
};

export const updateClient = async (rut: string, client: Client) => {
  const sr = `<?xml version="1.0" encoding="utf-8"?>
  <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
    <soap12:Body>
      <Modifico_Datos_Cliente xmlns="http://infrasistemas.sytes.net:7080/">
        <JSON>${JSON.stringify(transformClient(rut, client))}</JSON>
      </Modifico_Datos_Cliente>
    </soap12:Body>
  </soap12:Envelope>`;

  const updateCliente: WebService<string> = {
    url: modifyClientURL,
    name: 'Modifico_Datos_Cliente',
    resultSelector: 'Modifico_Datos_ClienteResult',
    sr,
    transform: (res) => res,
  };

  return post(updateCliente);
};
