import React, { useEffect, useState } from 'react';
import { Modal, Select, Spin } from 'antd';
import { Client } from 'api';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'store';
import { getClientList, getProviderList } from 'store/clients';

interface ClientModalProps {
  onOk: (client: Client) => void;
  onCancel: () => void;
  visible: boolean;
  type: 'Client' | 'Provider';
}

export const ClientModal = ({
  onOk,
  onCancel,
  visible,
  type,
}: ClientModalProps) => {
  const [selected, setSelected] = useState<number | undefined>(undefined);
  const dispatch = useDispatch();
  const { clients, state: sliceState, providers } = useSelector(
    ({ clients }: RootState) => clients
  );

  useEffect(() => {
    dispatch(getClientList());
    dispatch(getProviderList());
  }, [dispatch]);

  useEffect(() => {
    setSelected(undefined);
  }, [visible]);

  const handleSubmit = () => {
    if (selected !== undefined) {
      onOk(type === 'Client' ? clients[selected] : providers[selected]);
    }
  };
  return (
    <Modal
      title="Agenda"
      visible={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      okButtonProps={{ disabled: selected === null }}
    >
      <Spin spinning={sliceState === 'LOADING'}>
        <Select
          onSelect={(value) => setSelected(value as number)}
          value={selected}
          style={{ width: '100%' }}
          placeholder={
            type === 'Client' ? 'Elija un cliente...' : 'Elija un proveedor...'
          }
        >
          {type === 'Client'
            ? clients.map((client, index) => (
                <Select.Option value={index}>{client.nombre}</Select.Option>
              ))
            : providers.map((provider, index) => (
                <Select.Option value={index}>{provider.nombre}</Select.Option>
              ))}
        </Select>
      </Spin>
    </Modal>
  );
};
