import React, { useState, useEffect } from 'react';
import { PageLayout } from 'components/PageLayout';
import { RootState } from 'store';
import { Tabs, Typography, Button, Alert, Spin } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { ClientTable, PeopleType } from 'components/ClientTable';
import { PlusOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { Client } from 'api';
import { ClientForm, FullSpace } from 'components/ClientForm';
import { StyledTabs } from 'components/StyledTabs';
import {
  getClientList,
  deleteClient,
  postClientThunk,
  updateClientThunk,
  postProviderThunk,
  updateProviderThunk,
  deleteProvider,
  getProviderList,
} from 'store/clients';

type Operation = 'NONE' | 'ADD' | 'EDIT';

interface State {
  client?: Client;
  operation: Operation;
  activeKey: PeopleType;
}

export const Agenda = () => {
  const [state, setState] = useState<State>({
    operation: 'NONE',
    activeKey: 'Client',
  });

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getClientList());
    dispatch(getProviderList());
  }, [dispatch]);

  const { clients, topeClientes, state: sliceState, providers } = useSelector(
    ({ clients }: RootState) => clients
  );

  const addClient = () =>
    setState((prev) => ({ ...prev, operation: 'ADD', client: undefined }));

  const handleTabChange = (key: string) => {
    setState((prev) => ({
      ...prev,
      activeKey: key as PeopleType,
      operation: 'NONE',
    }));
  };

  const handleEdit = (client: Client) => {
    setState((prev) => ({ ...prev, operation: 'EDIT', client }));
  };

  const handleCancel = () => {
    setState((prev) => ({ ...prev, operation: 'NONE', client: undefined }));
  };

  const handleSave = async (client: Client) => {
    if (state.activeKey === 'Client') {
      if (state.operation === 'ADD') {
        dispatch(postClientThunk(client));
      } else if (state.operation === 'EDIT') {
        dispatch(updateClientThunk(client));
      }
    } else {
      if (state.operation === 'ADD') {
        dispatch(postProviderThunk(client));
      } else if (state.operation === 'EDIT') {
        dispatch(updateProviderThunk(client));
      }
    }
    handleCancel();
  };

  const handleDelete = async (client: Client) => {
    if (state.activeKey === 'Client') {
      if (client.id) {
        dispatch(deleteClient(client.id));
      }
    } else {
      if (client.id) {
        dispatch(deleteProvider(client.id));
      }
    }
  };

  return (
    <PageLayout title="Agenda" whiteBg={false} padding={false}>
      <Spin spinning={sliceState === 'LOADING'}>
        <StyledTabs>
          <Tabs
            type="card"
            size="large"
            animated={false}
            activeKey={state.activeKey}
            onChange={handleTabChange}
          >
            <Tabs.TabPane tab="Clientes" key="Client">
              <FullSpace direction="vertical">
                {state.operation === 'NONE' && (
                  <ActionBar>
                    {topeClientes > 0 ? (
                      <Button type="primary" onClick={addClient}>
                        <PlusOutlined />
                        Nuevo Cliente
                      </Button>
                    ) : (
                      <Alert
                        type="warning"
                        message={`Llegó al límite de ${topeClientes} clientes`}
                      />
                    )}
                  </ActionBar>
                )}
                {state.operation === 'NONE' ? (
                  <ClientTable
                    people={clients}
                    type="Client"
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                  />
                ) : (
                  <>
                    <Typography.Title level={4}>
                      {state.operation === 'ADD' && `Ingresando nuevo Cliente`}
                      {state.operation === 'EDIT' && `Editando Cliente`}
                    </Typography.Title>
                    <ClientForm
                      client={state.client}
                      type="Client"
                      onCancel={handleCancel}
                      onSubmit={handleSave}
                    />
                  </>
                )}
              </FullSpace>
            </Tabs.TabPane>
            <Tabs.TabPane tab="Proveedores" key="Provider">
              <FullSpace direction="vertical">
                {state.operation === 'NONE' && (
                  <ActionBar>
                    {topeClientes > 0 ? (
                      <Button type="primary" onClick={addClient}>
                        <PlusOutlined />
                        Nuevo Proveedor
                      </Button>
                    ) : (
                      <Alert
                        type="warning"
                        message={`Llegó al límite de ${topeClientes} Proveedores`}
                      />
                    )}
                  </ActionBar>
                )}
                {state.operation === 'NONE' ? (
                  <ClientTable
                    people={providers}
                    type="Provider"
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                  />
                ) : (
                  <>
                    <Typography.Title level={4}>
                      {state.operation === 'ADD' &&
                        `Ingresando nuevo Proveedor`}
                      {state.operation === 'EDIT' && `Editando Proveedor`}
                    </Typography.Title>
                    <ClientForm
                      client={state.client}
                      type="Provider"
                      onCancel={handleCancel}
                      onSubmit={handleSave}
                    />
                  </>
                )}
              </FullSpace>
            </Tabs.TabPane>
          </Tabs>
        </StyledTabs>
      </Spin>
    </PageLayout>
  );
};

const ActionBar = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
  align-items: center;
`;
