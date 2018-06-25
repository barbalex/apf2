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
}:{
  apId: String,
  jahr: Number,
}) =>
  <Query
    query={dataGql}
    variables={{ apId }}
  >
    {({ loading, error, data }) => {
      if (error) return `Fehler: ${error.message}`
      const oneLPop = get(data, 'apById.oneLPop.nodes', [])
        .filter(p => get(p, 'tpopsByPopId.totalCount') > 0)
        .length
      const oneLTpop = sum(
        get(data, 'apById.oneLTpop.nodes', [])
          .map(p => get(p, 'tpopsByPopId.totalCount'))
      )
      const threeLPop = get(data, 'apById.threeLPop.nodes', [])
        .filter(p => get(p, 'tpopsByPopId.totalCount') > 0)
        .length
      const threeLTpop = sum(
        get(data, 'apById.threeLTpop.nodes', [])
          .map(p => get(p, 'tpopsByPopId.totalCount'))
      )

      return (
        <Container>
          <Row>
            <Year>{jahr}</Year>
          </Row>
          <LabelRow>
            <Label1></Label1>
            <PopBerJahr>Pop</PopBerJahr>
            <TpopBerJahr>TPop</TpopBerJahr>
            <PopSeit></PopSeit>
            <TpopSeit></TpopSeit>
          </LabelRow>
          <Row>
            <Label1>Anzahl bekannt</Label1>
            <PopBerJahr>{oneLPop}</PopBerJahr>
            <TpopBerJahr>{oneLTpop}</TpopBerJahr>
            <PopSeit></PopSeit>
            <TpopSeit></TpopSeit>
          </Row>
          <Row>
            <Label2>aktuell:</Label2>
          </Row>
          <Row>
            <Label3>ursprünglich</Label3>
            <PopBerJahr>{threeLPop}</PopBerJahr>
            <TpopBerJahr>{threeLTpop}</TpopBerJahr>
            <PopSeit></PopSeit>
            <TpopSeit></TpopSeit>
          </Row>
        </Container>
      )
    }}
  </Query>
  

export default AMengen
