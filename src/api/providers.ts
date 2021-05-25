/* eslint-disable @typescript-eslint/camelcase */
import { post, WebService } from './utils';
import { Client, transformClients } from './clients';

const postProviderUrl = `https://infrasistemas.sytes.net:7080/WebService.asmx?op=Recibo_Datos_Proveedor`;

const getProvidersURL = `https://infrasistemas.sytes.net:7080/WebService.asmx?op=Listado_Provedores`;

const deleteProviderURL = `https://infrasistemas.sytes.net:7080/WebService.asmx?op=Elimino_Proveedor`;

const updateProviderUrl = `https://infrasistemas.sytes.net:7080/WebService.asmx?op=Modifico_Datos_Proveedor`;

export const transformProvider = (rut: string, client: Client) => ({
  Proveedor_Empresa: rut,
  Proveedor_Id: client?.id,
  Proveedor_Nombre: client.nombre,
  Proveedor_Ciudad: client.ciudad,
  Proveedor_Cédula: client.cedula,
  Proveedor_Departamento: client.departamento,
  Proveedor_Dirección: client.direccion,
  Proveedor_RUT: client.rut,
});

export const postProvider = async (rut: string, client: Client) => {
  const sr = `<?xml version="1.0" encoding="utf-8"?>
    <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
      <soap12:Body>
        <Recibo_Datos_Proveedor xmlns="http://infrasistemas.sytes.net:7080/">
          <JSON>${JSON.stringify(transformProvider(rut, client))}</JSON>
        </Recibo_Datos_Proveedor>
      </soap12:Body>
    </soap12:Envelope>`;

  const postProveedorWS: WebService<string> = {
    url: postProviderUrl,
    name: 'Recibo_Datos_Proveedor',
    resultSelector: 'Recibo_Datos_ProveedorResult',
    sr,
    transform: (res) => res,
  };

  return post(postProveedorWS);
};

export const getProviders = async (rut: string) => {
  const sr = `<?xml version="1.0" encoding="utf-8"?>
  <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
      <Listado_Proveedores xmlns="http://infrasistemas.sytes.net:7080/">
        <RUT>${rut}</RUT>
      </Listado_Proveedores>
    </soap:Body>
  </soap:Envelope>`;

  const getProveedoresWS: WebService<Client[]> = {
    url: getProvidersURL,
    name: 'Listado_Proveedores',
    resultSelector: 'Listado_ProveedoresResult',
    sr,
    transform: transformClients,
  };

  return post(getProveedoresWS);
};

export const deleteProvider = async (rut: string, id: number) => {
  const sr = `<?xml version="1.0" encoding="utf-8"?>
   <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
     <soap12:Body>
       <Elimino_Proveedor xmlns="http://infrasistemas.sytes.net:7080/">
         <RUT>${rut}</RUT>
         <Id>${id}</Id>
       </Elimino_Proveedor>
     </soap12:Body>
   </soap12:Envelope>`;

  const deleteProveedorWS: WebService<string> = {
    url: deleteProviderURL,
    name: 'Elimino_Proveedor',
    resultSelector: 'Elimino_ProveedorResult',
    sr,
    transform: (res) => res,
  };

  return post(deleteProveedorWS);
};

export const updateProvider = async (rut: string, client: Client) => {
  const sr = `<?xml version="1.0" encoding="utf-8"?>
  <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
    <soap12:Body>
      <Modifico_Datos_Proveedor xmlns="http://infrasistemas.sytes.net:7080/">
        <JSON>${JSON.stringify(transformProvider(rut, client))}</JSON>
      </Modifico_Datos_Proveedor>
    </soap12:Body>
  </soap12:Envelope>`;

  const updateProveedorWS: WebService<string> = {
    url: updateProviderUrl,
    name: 'Modifico_Datos_Proveedor',
    resultSelector: 'Modifico_Datos_ProveedorResult',
    sr,
    transform: (res) => res,
  };

  return post(updateProveedorWS);
};
