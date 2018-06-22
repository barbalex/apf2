// @flow
import React, { Fragment } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'


const Row = styled.div`
  display: flex;
  padding: 0.1cm 0;
`
const Year = styled.div`
  width: 1.5cm;
`
const Typ = styled.div`
  width: 3.5cm;
  padding-right: 0.5cm;
`
const Goal = styled.div`
  width: 100%;
`

const Ziele = ({ ziele }:{ziele: Array<Object>}) =>
  <Fragment>
    <Row key="head">
      <Year>Ziel</Year><Typ>Zieltyp</Typ><Goal>Ziel</Goal>
    </Row>
    {
      ziele.map(z =>
        <Row key={z.id}>
          <Year>{z.jahr || '(fehlt)'}</Year>
          <Typ>{get(z, 'zielTypWerteByTyp.text', '(fehlt)')}</Typ>
          <Goal>{z.bezeichnung || '(fehlt)'}</Goal>
        </Row>
      )
    }
  </Fragment>
  

export default Ziele
