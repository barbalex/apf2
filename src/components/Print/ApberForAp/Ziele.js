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
const Typ = styled.div`
  width: 5.5cm;
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
    <Title>Ziele im Berichtsjahr:</Title>
    <TitleRow>
      <Typ>Typ</Typ><Goal>Ziel</Goal>
    </TitleRow>
    {
      ziele.map(z =>
        <Row key={z.id}>
          <Typ>{get(z, 'zielTypWerteByTyp.text', '')}</Typ>
          <Goal>{z.bezeichnung || ''}</Goal>
        </Row>
      )
    }
  </Container>
  

export default Ziele
