import React from 'react';
import { Table, Empty } from 'antd';

import { Remaining } from 'api';
import { ColumnsType } from 'antd/lib/table';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import { TableStyle } from './TableStyle';

// TODO add responsive
const columns: ColumnsType<Remaining> = [
  {
    title: 'Tipo',
    dataIndex: 'tipo',
    key: 'tipo',
  },
  {
    title: 'Desde',
    dataIndex: 'desde',
    key: 'desde',
    align: 'right',
  },
  {
    title: 'Hasta',
    dataIndex: 'hasta',
    key: 'hasta',
    align: 'right',
  },
  {
    title: 'Vence',
    dataIndex: 'vence',
    key: 'vence',
  },
  {
    title: 'Utilizados',
    dataIndex: 'utilizados',
    key: 'utilizados',
    align: 'right',
  },
  {
    title: 'Restantes',
    dataIndex: 'quedan',
    key: 'quedan',
    align: 'right',
  },
];

export const RemainingTable = () => {
  const remaining = useSelector(({ docs }: RootState) => docs.remaining);
  return (
    <TableStyle>
      <Table
        locale={{
          emptyText: (
            <Empty
              description="No hay datos"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          ),
        }}
        columns={columns}
        dataSource={remaining}
      />
    </TableStyle>
  );
};
