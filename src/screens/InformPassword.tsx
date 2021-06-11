import React from 'react';
import { PageLayout } from 'components/PageLayout';
import { Tabs } from 'antd';
import { ChangePassword } from 'components/ChangePassword';
import { ChangeDefaultPassword } from 'components/ChangeDefaultPassword'
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import { StyledTabs } from 'components/StyledTabs';

let keyName = 'docs';
export const setName = (name:string) => {
  keyName = name;
}
export const InformPassword = () => {
  const cert = useSelector(({ app }: RootState) => app.certificate);
  const available = useSelector(({ docs }: RootState) => docs.available);
  
  return (
    <PageLayout title="Cambio de Contraseña Necesaria" padding={false} whiteBg={false}>
      <StyledTabs>
            <ChangeDefaultPassword />
      </StyledTabs>
    </PageLayout>
  );
};
