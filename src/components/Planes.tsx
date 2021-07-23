import React, { useEffect } from 'react'
import {Row, Col, Divider, Typography, Button} from 'antd'
import styled from 'styled-components';
import { HomeTwoTone, StarTwoTone, CrownTwoTone } from '@ant-design/icons';
import { RootState } from 'store';
import { useSelector, useDispatch } from 'react-redux';
import { updatePlane } from 'store/plane';

import * as api from 'api';

const { Title, Text } = Typography;

export const Planes =  () => {

    const { rut, error } = useSelector(({ app }: RootState) => app);
    let plan_type : any;
    const { type } = useSelector(
        ({ plane }: RootState) => plane
    );
    const dispatch = useDispatch();

    useEffect(() => {
      dispatch(updatePlane());
    }, [dispatch]);

    return (
        <>
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} style = {{margin : '20px 0px'}}>
                <Col className="gutter-row" span={8}>
                    <div>
                        <Section1>
                            <HomeTwoTone twoToneColor="#52c41a" style={basic_icon_style} />
                            <Title level={2} style={{fontWeight : 'bold', margin : '0px', color: 'white'}}>Plan Básico</Title>
                            { type == 'Básico' ? (
                                <Title level={4} style={sub_header_style}>(usted tiene contratado este)</Title>
                            ) : <Title level={4} style={{margin:'0px', padding:'30px'}}></Title>}
                        </Section1>
                        <Section3 style = {{padding: '65px 0px'}}>
                            <ul style = {{textAlign : 'left'}}>
                                <List><Text style = {{textAlign : 'left', fontSize : '16px'}}>Límite de Documentos:</Text><Text style = {{textAlign : 'left', fontSize : '16px', fontWeight : 'bold'}}> 50</Text></List>
                                <List><Text style = {{textAlign : 'left', fontSize : '16px'}}>Límite de Clientes y Proveedores:</Text><Text style = {{textAlign : 'left', fontSize : '16px', fontWeight : 'bold'}}> 10</Text></List>
                                <List style = {{paddingRight : '10px'}}><Text style = {{textAlign : 'left', fontSize : '16px'}}>Documentos:</Text><Text style = {{textAlign : 'left', fontSize : '16px', fontWeight : 'bold'}}> eTickets, eFacturas y Notas de Crédito.</Text></List>
                            </ul>  
                        </Section3>
                    </div>
                </Col>
                <Col className="gutter-row" span={8}>
                    <div>
                        <Section1>
                            <StarTwoTone twoToneColor="#0a32c4" style={standard_icon_style} />
                            <Title level={2} style={{fontWeight : 'bold', margin : '0px', color: 'white'}}>Plan Estándar</Title>
                            { type == 'Estándar' ? (
                                <Title level={4} style={sub_header_style}>(usted tiene contratado este)</Title>
                            ) : <Title level={4} style={{margin:'0px', padding:'30px'}}></Title>}
                        </Section1>
                        <Section3>
                            <ul style = {{textAlign : 'left'}}>
                                <List><Text style = {{textAlign : 'left', fontSize : '16px'}}>Límite de Documentos:</Text><Text style = {{textAlign : 'left', fontSize : '16px', fontWeight : 'bold'}}> 100</Text></List>
                                <List><Text style = {{textAlign : 'left', fontSize : '16px'}}>Límite de Clientes y Proveedores:</Text><Text style = {{textAlign : 'left', fontSize : '16px', fontWeight : 'bold'}}> 25</Text></List>
                                <List style = {{paddingRight : '10px'}}><Text style = {{textAlign : 'left', fontSize : '16px'}}>Documentos:</Text><Text style = {{textAlign : 'left', fontSize : '16px', fontWeight : 'bold'}}> eTickets, eFacturas, Notas de Crédito, eResguardos y eFacturas de Exportación.</Text></List>
                            </ul> 
                        </Section3>
                    </div>
                </Col>
                <Col className="gutter-row" span={8}>
                    <div>
                        <Section1>
                            <CrownTwoTone twoToneColor="#c4b31a" style={premium_icon_style} />
                            <Title level={2} style={{fontWeight : 'bold', margin : '0px', color: 'white'}}>Plan Premium</Title>
                            { type == 'Premium' ? (
                                <Title level={4} style={sub_header_style}>(usted tiene contratado este)</Title>
                            ) : <Title level={4} style={{margin:'0px', padding:'30px'}}></Title>}
                        </Section1>
                        <Section3>
                            <ul style = {{textAlign : 'left'}}>
                                <List><Text style = {{textAlign : 'left', fontSize : '16px'}}>Límite de Documentos:</Text><Text style = {{textAlign : 'left', fontSize : '16px', fontWeight : 'bold'}}> 200</Text></List>
                                <List><Text style = {{textAlign : 'left', fontSize : '16px'}}>Límite de Clientes y Proveedores:</Text><Text style = {{textAlign : 'left', fontSize : '16px', fontWeight : 'bold'}}> 50</Text></List>
                                <List style = {{paddingRight : '10px'}}><Text style = {{textAlign : 'left', fontSize : '16px'}}>Documentos:</Text><Text style = {{textAlign : 'left', fontSize : '16px', fontWeight : 'bold'}}> eTickets, eFacturas, Notas de Crédito, eResguardos y eFacturas de Exportación.</Text></List>
                            </ul> 
                        </Section3>
                    </div>
                </Col>
            </Row>
            <ul style = {{textAlign : 'left'}}>
            <List><Text style = {{textAlign : 'left', fontSize : '16px', fontWeight : 'bold'}}>¿Tal vez precises más funciones?</Text><Text style = {{textAlign : 'left', fontSize : '16px'}}> ¿Te gustaría llevar estados de cuenta? ¿Control de Stock? Puede ser que VEGA no sea la solución más adecuada para tí. Pero no te preocupes, porque tenemos más soluciones!</Text></List>
            </ul> 
        </>
    )
}

export const Section1 = styled.div`
  background-color: #3575D3;
  text-align: center;
  height: auto;
  border-top : 1px solid #3575D3;
  border-right : 1px solid #3575D3;
  border-left : 1px solid #3575D3;
`;

export const Section2 = styled.div`
  padding: 10px;
  background-color: #ffffff;
  text-align: center;
  height: auto;
  border-right : 1px solid #3575D3;
  border-left : 1px solid #3575D3;
`;

export const Section3 = styled.div`
  padding: 50px 0px;
  background-color: #ffffff;
  text-align: center;
  height: auto;
  border-right : 1px solid #3575D3;
  border-left : 1px solid #3575D3;
  border-bottom : 1px solid #3575D3;
`;

export const List = styled.li`
  margin: 10px0px;
`;


const style = { 
    background: '#cbd4dc', 
    padding: '8px', 
    height: '100px', 
    margin: 'auto', 
    alignItems: 'center',
    // display: 'flex',
    justifyContent: 'center',
    flex : 1,
    
};

const basic_icon_style = {
    fontSize: '40px', 
    margin : '16px',
    padding : '15px',
    height: '80px',
    borderRadius: '40px',
    backgroundColor: '#52c41a',
    width: '80px',
    // opacity: '70%'
}

const standard_icon_style = {
    fontSize: '40px', 
    margin : '16px',
    padding : '15px',
    height: '80px',
    borderRadius: '40px',
    backgroundColor: '#0a32c4',
    width: '80px',
    // opacity: '70%'
}

const premium_icon_style = {
    fontSize: '40px', 
    margin : '16px',
    padding : '15px',
    height: '80px',
    borderRadius: '40px',
    backgroundColor: '#c4b31a',
    width: '80px',
    // opacity: '70%'
}

const header_style = {
    fontWeight: 'bold',
    margin: '0px'
}

const sub_header_style = {
    fontSize: '18px', 
    font: 'bold',
    margin: '0px',
    borderBottom : '1px solid #3575D3',
    padding: '15px'
}