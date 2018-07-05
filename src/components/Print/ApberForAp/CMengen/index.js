// @flow
import React from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import sum from 'lodash/sum'
import { Query } from 'react-apollo'

import dataGql from './data.graphql'

const Container = styled.div`
  padding: 0.2cm 0;
`
const Row = styled.div`
  display: flex;
  padding: 0.05cm 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1) !important;
`
const LabelRow = styled(Row)`
  font-size: 12px;
`
const Year = styled.div`
  position: relative;
  left: 10.9cm;
  width: 2cm;
`
const YearSince = styled.div`
  position: relative;
  left: 11.45cm;
  width: 2cm;
`
const Label1 = styled.div`
  min-width: 10cm;
  max-width: 10cm;
`
const Label2 = styled.div`
  min-width: 8.8cm;
  max-width: 8.8cm;
  padding-left: 1.2cm;
`
const Label3 = styled.div`
  min-width: 7.8cm;
  max-width: 7.8cm;
  padding-left: 2.2cm;
`
const Number = styled.div`
  min-width: 1cm;
  max-width: 1cm;
  text-align: right;
`
const PopBerJahr = styled(Number)``
const TpopBerJahr = styled(Number)`
  padding-right: 1cm;
`
const PopSeit = styled(Number)``
const TpopSeit = styled(Number)``

const AMengen = ({
  apId,
  jahr,
  startJahr,
}:{
  apId: String,
  jahr: Number,
  startJahr: Number,
}) =>
  <Query
    query={dataGql}
    variables={{ apId, startJahr }}
  >
    {({ loading, error, data }) => {
      if (error) return `Fehler: ${error.message}`

      return (
        <Container>
          <Row>
            <Year>{jahr}</Year>
            <YearSince>{`Seit TODO`}</YearSince>
          </Row>
          <LabelRow>
            <Label1></Label1>
            <PopBerJahr>Pop</PopBerJahr>
            <TpopBerJahr>TPop</TpopBerJahr>
            <PopSeit>Pop</PopSeit>
            <TpopSeit>TPop</TpopSeit>
          </LabelRow>
          <Row>
            <Label1>Anzahl Populationen/Teilpopulationen mit Massnahmen</Label1>
            <PopBerJahr>{}</PopBerJahr>
            <TpopBerJahr>{}</TpopBerJahr>
            <PopSeit>{}</PopSeit>
            <TpopSeit>{}</TpopSeit>
          </Row>
          <Row>
            <Label2>kontrolliert</Label2>
          </Row>
          <Row>
            <Label3>sehr erfolgreich</Label3>
            <PopBerJahr>{}</PopBerJahr>
            <TpopBerJahr>{}</TpopBerJahr>
            <PopSeit>{}</PopSeit>
            <TpopSeit>{}</TpopSeit>
          </Row>
          <Row>
            <Label3>erfolgreich</Label3>
            <PopBerJahr>{}</PopBerJahr>
            <TpopBerJahr>{}</TpopBerJahr>
            <PopSeit>{}</PopSeit>
            <TpopSeit>{}</TpopSeit>
          </Row>
          <Row>
            <Label3>weniger erfolgreich</Label3>
            <PopBerJahr>{}</PopBerJahr>
            <TpopBerJahr>{}</TpopBerJahr>
            <PopSeit>{}</PopSeit>
            <TpopSeit>{}</TpopSeit>
          </Row>
          <Row>
            <Label3>nicht erfolgreich</Label3>
            <PopBerJahr>{}</PopBerJahr>
            <TpopBerJahr>{}</TpopBerJahr>
            <PopSeit></PopSeit>
            <TpopSeit></TpopSeit>
          </Row>
          <Row>
            <Label3>mit unsicherer Wirkung</Label3>
            <PopBerJahr>{}</PopBerJahr>
            <TpopBerJahr>{}</TpopBerJahr>
            <PopSeit>{}</PopSeit>
            <TpopSeit>{}</TpopSeit>
          </Row>
        </Container>
      )
    }}
  </Query>
  

export default AMengen
