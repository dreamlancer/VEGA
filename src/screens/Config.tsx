import React from 'react';
import { PageLayout } from 'components/PageLayout';
import { Tabs } from 'antd';
import { Preferences } from 'components/Preferences';
import { RemainingTable } from 'components/Remaining';
import { ChangePassword } from 'components/ChangePassword';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import { StyledTabs } from 'components/StyledTabs';

let keyName = 'docs';
export const setName = (name:string) => {
  keyName = name;
}
export const Config = () => {
  const cert = useSelector(({ app }: RootState) => app.certificate);
  const available = useSelector(({ docs }: RootState) => docs.available);
  
  return (
    <PageLayout title="Configuración" padding={false} whiteBg={false}>
      <StyledTabs>
        <Tabs type="card" animated={false} size="large" defaultActiveKey={keyName}>
          <Tabs.TabPane tab="Documentos Restantes" key="docs">
            Documentos utilizados este mes: {available}
          </Tabs.TabPane>
          <Tabs.TabPane tab="CAEs" key="caes">
            <RemainingTable />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Preferencias" key="preferencias">
            <Preferences />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Seguridad" key="seguridad">
            <ChangePassword />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Vencimientos" key="vencimientos">
            Vencimiento de Certificado {cert ? cert : 'Error'}
          </Tabs.TabPane>
        </Tabs>
      </StyledTabs>
    </PageLayout>
  );
};
