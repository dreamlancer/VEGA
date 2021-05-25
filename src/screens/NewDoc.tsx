import React from 'react';
import { PageLayout } from 'components/PageLayout';
import { DocumentForm } from 'components/DocumentForm';

export const NewDoc = () => {
  return (
    <PageLayout title="Nuevo Documento" padding={false} whiteBg={false}>
      <DocumentForm />
    </PageLayout>
  );
};
