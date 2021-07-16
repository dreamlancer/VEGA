import React, { useEffect } from 'react';
import { PageLayout } from 'components/PageLayout';
import { RootState } from 'store';
import { DocumentsTable } from 'components/DocumentsTable';
import { Tabs, Spin } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { ExportForm } from 'components/ExportForm';
import { updateDocuments, updateCompras } from 'store/docs';
import { StyledTabs } from 'components/StyledTabs';

export const Dashboard = () => {
  const dispatch = useDispatch();
  let { compras, documents, state } = useSelector(
    ({ docs }: RootState) => docs
  );
  useEffect(() => {
    dispatch(updateCompras());
    dispatch(updateDocuments());
  }, [dispatch]);

  return (
    <PageLayout title="Mis Documentos" padding={false} whiteBg={false}>
      <StyledTabs>
        <Tabs type="card" animated={false} size="large">
          <Tabs.TabPane tab="Ventas" key="1">
            <Spin spinning={state === 'LOADING'}>
              <DocumentsTable documents={documents} type="Sales" />
            </Spin>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Compras" key="2">
            <Spin spinning={state === 'LOADING'}>
              <DocumentsTable documents={compras} type="Purchases" />
            </Spin>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Exportar" key="3">
            <ExportForm />
          </Tabs.TabPane>
        </Tabs>
      </StyledTabs>
    </PageLayout>
  );
};
