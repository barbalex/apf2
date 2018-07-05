// @flow
import React from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import uniqBy from 'lodash/uniqBy'
import min from 'lodash/min'
import flatten from 'lodash/flatten'
import groupBy from 'lodash/groupBy'
import maxBy from 'lodash/maxBy'
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

const CMengen = ({
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
    variables={{ apId, jahr }}
  >
    {({ loading, error, data }) => {
      if (error) return `Fehler: ${error.message}`

      const oneLTpop_pop = get(data, 'apById.oneLTpop.nodes', [])
      const oneLTpop_tpop = flatten(
        oneLTpop_pop.map(p =>
          get(p, 'tpopsByPopId.nodes', [])
        )
      ).filter(p =>
        get(p, 'tpopmassnsByTpopId.totalCount', 0) > 0
      )
      const oneLTpop = oneLTpop_tpop.length
      const oneLPop = uniqBy(oneLTpop_tpop, 'popId').length

      const oneRTpop_pop = get(data, 'apById.oneRTpop.nodes', [])
      const oneRTpop_tpop = flatten(
        oneRTpop_pop.map(p =>
          get(p, 'tpopsByPopId.nodes', [])
        )
      )
      const massns = flatten(
        oneRTpop_tpop.map(p =>
          get(p, 'tpopmassnsByTpopId.nodes', [])
        )
      )
      const massnbers = flatten(
        oneRTpop_tpop.map(p =>
          get(p, 'tpopmassnbersByTpopId.nodes', [])
        )
      )
      const oneRTpop_firstYear = min(
        massns.map(b =>
          b.jahr
        )
      )
      const oneRPop_massnbersByPopId = groupBy(massnbers, b => b.popId)
      const oneRPop_lastMassnbers = Object.keys(oneRPop_massnbersByPopId).map(b =>
        maxBy(oneRPop_massnbersByPopId[b], 'jahr')
      )

      // 1.
      const oneRPop = uniqBy(massns, b =>
        get(b, 'tpopByTpopId.popId')
      ).length
      const oneRTpop = uniqBy(massns, b =>
        get(b, 'tpopByTpopId.id')
      ).length

      // 2.
      const twoRPop = uniqBy(massnbers, b =>
        get(b, 'tpopByTpopId.popId')
      ).length
      const twoRTpop = uniqBy(massnbers, b =>
        get(b, 'tpopByTpopId.id')
      ).length

      // 3.
      const threeRPop = oneRPop_lastMassnbers
        .filter(b => b.entwicklung === 2)
        .length
      const threeRTpop = oneRTpop_lastMassnbers
        .filter(b => b.entwicklung === 2)
        .length

      return (
        <Container>
          <Row>
            <Year>{jahr}</Year>
            <YearSince>{`Seit ${oneRTpop_firstYear}`}</YearSince>
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
            <PopBerJahr>{oneLPop}</PopBerJahr>
            <TpopBerJahr>{oneLTpop}</TpopBerJahr>
            <PopSeit>{oneRPop}</PopSeit>
            <TpopSeit>{oneRTpop}</TpopSeit>
          </Row>
          <Row>
            <Label2>kontrolliert</Label2>
            <PopBerJahr></PopBerJahr>
            <TpopBerJahr></TpopBerJahr>
            <PopSeit>{twoRPop}</PopSeit>
            <TpopSeit>{twoRTpop}</TpopSeit>
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
  

export default CMengen
