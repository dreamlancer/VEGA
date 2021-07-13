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
import moment from 'moment';

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
  return date_start ? date_start : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
}

function getEndDate(){
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
  
  const [dates, setDates] = useState([]);
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
    date_start = null;
    date_end = null;
    setDocs({
      documents,
      type
    });
  }
 }

 const disabledDate = (current : any)=> {
  const today = moment();
  if (current.isBefore(today)) {
    return current.isBefore(today.subtract(300, 'days'));
  }
  return current.isAfter(today.add(1, 'day').startOf('day'));
  };

  const onOpenChange = (open : any) => {
    if (open) {
   
    } else {

    }
  };

  const handleChange = (value:any) => {
    setDates(value);
  }

  return (
    <TableStyle pointer>
      <Form>
        <Form.Item
          name="dates"
          label="Seleccione el mes:"
          rules={[
            {
            },
            () => ({
              validator(rule, value: any) {
                
                if (!value) {
                  return Promise.reject('');
                }
                const initial = value;
                date_start = new Date(new Date(initial.format('MM/DD/yyyy')).getFullYear(), new Date(initial.format('MM/DD/yyyy')).getMonth(), 1);
                date_end = new Date(new Date(initial.format('MM/DD/yyyy')).getFullYear(), new Date(initial.format('MM/DD/yyyy')).getMonth() + 1, 0);
                handleDateFinish();
              },
            }),
          ]}
        >
            <DatePicker
              defaultValue={moment(new Date(), 'YYYY-MM')}
              picker="month"
              locale={datepickerLocale}
              disabledDate={disabledDate}
              format="MM/YYYY"
              popupStyle={{
                fontSize: "13px",
              }}
            />
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
