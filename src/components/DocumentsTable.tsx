import React from 'react';
import { Table, Empty } from 'antd';

import { Document } from 'api';
import { ColumnsType } from 'antd/lib/table';
import { TableStyle } from './TableStyle';
import { esPaginationLocale } from 'constants/paginationLocale';
import { buildPDF } from 'api/utils';
import { RootState } from 'store';
import { useSelector } from 'react-redux';

function getDate() {
  let today = new Date();
  let dd = String(today.getDate()-1).padStart(2, '0');
  let mm = String(today.getMonth()+1).padStart(2, '0'); //January is 0!
  let yyyy = today.getFullYear();
  let newD = mm + '/' + dd + '/' + yyyy;
  return new Date(newD).getTime();
}

// TODO add responsive
const columns = (type: DocumentType): ColumnsType<Document> => [
  {
    title: 'Documento',
    dataIndex: 'cfe',
    key: 'cfe',
  },
  {
    title: 'Serie',
    dataIndex: 'serie',
    key: 'serie',
  },
  {
    title: 'Número',
    dataIndex: 'numero',
    key: 'numero',
    align: 'right',
  },
  {
    title: 'Fecha',
    dataIndex: 'fecha',
    key: 'fecha',
  },
  {
    title: type === 'Purchases' ? 'Proveedor' : 'Cliente',
    dataIndex: 'cliente',
    key: 'cliente',
  },
  {
    title: 'Total',
    dataIndex: 'importe',
    key: 'importe',
    align: 'right',
  },
  {
    title: 'Moneda',
    dataIndex: 'moneda',
    key: 'moneda',
  },
  {
    title: 'Tipo',
    dataIndex: 'tipoPago',
    key: 'tipoPago',
  },
  {
    title: 'Estado',
    dataIndex: 'estado',
    key: 'estado',
  },
];

type DocumentType = 'Purchases' | 'Sales';

interface DocumentsTableProps {
  documents: Document[];
  type: DocumentType;
}
export const DocumentsTable = ({ documents, type }: DocumentsTableProps) => {
  const { rut, impresion } = useSelector((state: RootState) => ({
    rut: state.app.rut,
    impresion: state.preferences.impresion,
  }));

  return (
    <TableStyle pointer>
      <Table
        locale={{
          emptyText: (
            <Empty
              description="No hay datos"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          ),
        }}
        pagination={{
          locale: esPaginationLocale,
        }}
        rowClassName={(record: Document) =>
          // ['En espera', 'Error', 'Rechazado'].includes(record.estado)
          record.estado === 'Rechazado' || record.estado === 'Error' || (record.pdfPayload.fechaGetTime < getDate() && record.estado === 'En espera')
            ? 'waiting'
            : ''
        }
        columns={columns(type)}
        dataSource={documents}
        onRow={(record) => ({
          onClick:
            type === 'Purchases'
              ? () => window.open(record.pdf, '_blank')
              : () =>
                  window.open(
                    buildPDF(String(rut), impresion, record.pdfPayload),
                    '_blank'
                  ),
        })}
      />
      
    </TableStyle>
  );
};
