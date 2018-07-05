// @flow
import React from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import flatten from 'lodash/flatten'
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

const BMengen = ({
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
    variables={{ apId, startJahr, jahr }}
  >
    {({ loading, error, data }) => {
      if (error) return `Fehler: ${error.message}`

      // 1.
      const oneLPop_pop = get(data, 'apById.oneLPop.nodes', [])
        .filter(p => get(p, 'tpopsByPopId.totalCount') > 0)
        .filter(p => get(p, 'popbersByPopId.totalCount') > 0)
      const oneLPop = oneLPop_pop.length
      const oneLPop_popbers = flatten(
        oneLPop_pop.map(p =>
          get(p, 'popbersByPopId.nodes', [])
        )
      )

      const oneLTpop_pop = get(data, 'apById.oneLTpop.nodes', [])
      const oneLTpop_tpop = flatten(
        oneLTpop_pop.map(p =>
          get(p, 'tpopsByPopId.nodes', [])
        )
      )
      const oneLTpop = flatten(
        oneLTpop_tpop.map(p =>
          get(p, 'tpopbersByTpopId.totalCount', 0)
        )
      )
        .filter(tpopbersCount => tpopbersCount > 0)
        .length
      const oneLTpop_tpopbers = flatten(
        oneLTpop_tpop.map(t =>
          get(t, 'tpopbersByTpopId.nodes', [])
        )
      )

      const oneRPop = get(data, 'apById.oneRPop.nodes', [])
        .filter(p => get(p, 'tpopsByPopId.totalCount') > 0)
        .filter(p => get(p, 'popbersByPopId.totalCount') > 0)
        .length

      const oneRTpop_pop = get(data, 'apById.oneRTpop.nodes', [])
      const oneRTpop_tpop = flatten(
        oneRTpop_pop.map(p =>
          get(p, 'tpopsByPopId.nodes', [])
        )
      )
      const oneRTpop = flatten(
        oneRTpop_tpop.map(p =>
          get(p, 'tpopbersByTpopId.totalCount', 0)
        )
      )
        .filter(tpopbersCount => tpopbersCount > 0)
        .length

      // 2.
      const twoLPop = oneLPop_popbers
        .filter(b => b.entwicklung === 3)
        .length
      const twoLTpop = oneLTpop_tpopbers
        .filter(b => b.entwicklung === 3)
        .length

      return (
        <Container>
          <Row>
            <Year>{jahr}</Year>
            <YearSince>{`Seit ${startJahr}`}</YearSince>
          </Row>
          <LabelRow>
            <Label1></Label1>
            <PopBerJahr>Pop</PopBerJahr>
            <TpopBerJahr>TPop</TpopBerJahr>
            <PopSeit>Pop</PopSeit>
            <TpopSeit>TPop</TpopSeit>
          </LabelRow>
          <Row>
            <Label1>kontrolliert (inkl. Ansaatversuche)</Label1>
            <PopBerJahr>{oneLPop}</PopBerJahr>
            <TpopBerJahr>{oneLTpop}</TpopBerJahr>
            <PopSeit>{oneRPop}</PopSeit>
            <TpopSeit>{oneRTpop}</TpopSeit>
          </Row>
          <Row>
            <Label3>zunehmend</Label3>
            <PopBerJahr>{twoLPop}</PopBerJahr>
            <TpopBerJahr>{twoLTpop}</TpopBerJahr>
            <PopSeit></PopSeit>
            <TpopSeit></TpopSeit>
          </Row>
          <Row>
            <Label3>stabil</Label3>
            <PopBerJahr>{}</PopBerJahr>
            <TpopBerJahr>{}</TpopBerJahr>
            <PopSeit></PopSeit>
            <TpopSeit></TpopSeit>
          </Row>
          <Row>
            <Label3>abnehmend</Label3>
            <PopBerJahr>{}</PopBerJahr>
            <TpopBerJahr>{}</TpopBerJahr>
            <PopSeit></PopSeit>
            <TpopSeit></TpopSeit>
          </Row>
          <Row>
            <Label3>unsicher</Label3>
            <PopBerJahr></PopBerJahr>
            <TpopBerJahr></TpopBerJahr>
            <PopSeit></PopSeit>
            <TpopSeit></TpopSeit>
          </Row>
          <Row>
            <Label3>erloschen</Label3>
            <PopBerJahr>{}</PopBerJahr>
            <TpopBerJahr>{}</TpopBerJahr>
            <PopSeit></PopSeit>
            <TpopSeit></TpopSeit>
          </Row>
        </Container>
      )
    }}
  </Query>
  

export default BMengen
