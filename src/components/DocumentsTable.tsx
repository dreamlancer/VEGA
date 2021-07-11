import React, { useState } from 'react';
import { Table, Empty, DatePicker, Form } from 'antd';

import { Document } from 'api';
import { ColumnsType } from 'antd/lib/table';
import { TableStyle } from './TableStyle';
import { esPaginationLocale } from 'constants/paginationLocale';
import { buildPDF } from 'api/utils';
import { RootState } from 'store';
import { useSelector } from 'react-redux';
import { datepickerLocale } from 'constants/datepickerLocale';

function getDate() {
  let today = new Date();
  let dd = String(today.getDate()-1).padStart(2, '0');
  let mm = String(today.getMonth()+1).padStart(2, '0'); //January is 0!
  let yyyy = today.getFullYear();
  let newD = mm + '/' + dd + '/' + yyyy;
  return new Date(newD).getTime();
}

let date_start : any;
let date_end : any;

function getStartDate(){
  console.log("date_startd", date_start);
  return date_start ? date_start : 0;
}

function getEndDate(){
  console.log("date_end", date_end);
  return date_end ? date_end : new Date().getTime();
}

const { RangePicker } = DatePicker;

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
  const { rut, impresion, start_new_date} = useSelector((state: RootState) => ({
    rut: state.app.rut,
    impresion: state.preferences.impresion,
    start_new_date : 0
  }));
 const [docs, setDocs] = useState<DocumentsTableProps>();

 const handleDateFinish = () => {
  setDocs({
    documents,
    type
  });
 }

 const handleColseDate = ( value : any ) => {
  if(value === null) {
    console.log("null");
    date_start = null;
    date_end = null;
    setDocs({
      documents,
      type
    });
  }
 }


  return (
    <TableStyle pointer>
      <Form>
        <Form.Item
          name="dates"
          label="Fechas"
          rules={[
            {
              // required: true,
              // message: 'Por favor seleccione un rango de fechas',
              // handleDateFinish()
            },
            () => ({
              validator(rule, value: [moment.Moment, moment.Moment]) {
                if (!value) {
                  return Promise.reject('');
                }
                const [initial, end] = value;
                date_start = new Date(initial.format('MM/DD/yyyy')).getTime();
                date_end = new Date(end.format('MM/DD/yyyy')).getTime();
                handleDateFinish();
                // return initial.isBefore(end)
                //   ? Promise.resolve()
                //   : Promise.reject(
                //       'Fecha inicial debe ser anterior a la final'
                //     );
              },
            }),
          ]}
        >
          <RangePicker locale={datepickerLocale} onChange={handleColseDate} format="DD/MM/YYYY" />
        </Form.Item>
      </Form>
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
        dataSource={documents.filter(document => document.pdfPayload.fechaGetTime > getStartDate() &&
          document.pdfPayload.fechaGetTime < getEndDate())}
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
