import React from 'react';
import { Result, Button, Col, Row } from 'antd';
import styled from 'styled-components';

interface ErrorComponentProps {
  name?: string;
  message?: string;
}
export const ErrorComponent = ({ name, message }: ErrorComponentProps) => {
  return (
    <Container>
      <Result
        status={500}
        title={name ? `Error en ${name}` : 'Ocurrió un error inesperado'}
        subTitle={message}
        extra={
          <Col>
            <Row>
              Ante cualquier duda comunicate al 4532 8662. Infra Sistemas.
            </Row>
            <Row justify="center">
              <Button type="link" onClick={() => window.location.reload()}>
                Volver al Inicio
              </Button>
            </Row>
          </Col>
        }
      />
    </Container>
  );
};

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
