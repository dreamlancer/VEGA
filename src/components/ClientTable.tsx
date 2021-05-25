import React from 'react';
import { Table, Empty, Button, Space, Popconfirm, Tooltip } from 'antd';

import { Client } from 'api';
import { ColumnsType } from 'antd/lib/table';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { TableStyle } from './TableStyle';

export type PeopleType = 'Client' | 'Provider';

interface ClientTableProps {
  people: Client[];
  type: PeopleType;
  onEdit: (client: Client) => void;
  onDelete: (client: Client) => void;
}
export const ClientTable = ({
  people,
  type,
  onEdit,
  onDelete,
}: ClientTableProps) => {
  // TODO add responsive
  const columns = (type: PeopleType): ColumnsType<Client> => [
    {
      title: 'Nombre',
      dataIndex: 'nombre',
      key: 'nombre',
    },
    {
      title: 'Dirección',
      dataIndex: 'direccion',
      key: 'direccion',
    },
    {
      title: 'Departamento',
      dataIndex: 'departamento',
      key: 'departamento',
    },
    {
      title: 'Ciudad',
      dataIndex: 'ciudad',
      key: 'ciudad',
    },
    {
      title: 'RUT',
      dataIndex: 'rut',
      key: 'rut',
    },
    {
      title: 'Cédula',
      dataIndex: 'cedula',
      key: 'cedula',
    },
    {
      title: 'Acciones',
      dataIndex: '',
      key: 'x',
      render: (client: Client) => {
        return (
          <Space>
            <Tooltip title="Editar">
              <Button onClick={() => onEdit(client)}>
                <EditOutlined />
              </Button>
            </Tooltip>

            <Popconfirm
              title="Seguro que desea eliminar?"
              onConfirm={() => onDelete(client)}
              okText="Sí"
              cancelText="No"
            >
              <Tooltip title="Eliminar">
                <Button>
                  <DeleteOutlined />
                </Button>
              </Tooltip>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

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
        columns={columns(type)}
        dataSource={people}
      />
    </TableStyle>
  );
};
