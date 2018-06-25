// @flow
import React from 'react'
import styled from 'styled-components'
import get from 'lodash/get'

const Container = styled.div`
  padding: 0.2cm 0;
`
const Title = styled.div`
  border-bottom: 1px solid rgba(0, 0, 0, 0.1) !important;
  font-weight: 600;
`
const Row = styled.div`
  display: flex;
  padding: 0.05cm 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1) !important;
`
const TitleRow = styled(Row)`
  color: grey;
`
const Year = styled.div`
  width: 1.7cm;
`
const Typ = styled.div`
  width: 3.8cm;
  padding-right: 0.5cm;
`
const Goal = styled.div`
  width: 100%;
`

const Ziele = ({
  ziele
}:{
  ziele: Array<Object>
}) =>
  <Container>
    <Title>Ziele:</Title>
    <TitleRow>
      <Year>Jahr</Year><Typ>Typ</Typ><Goal>Ziel</Goal>
    </TitleRow>
    {
      ziele.map(z =>
        <Row key={z.id}>
          <Year>{z.jahr || '(fehlt)'}</Year>
          <Typ>{get(z, 'zielTypWerteByTyp.text', '(fehlt)')}</Typ>
          <Goal>{z.bezeichnung || '(fehlt)'}</Goal>
        </Row>
      )
    }
  </Container>
  

export default Ziele
