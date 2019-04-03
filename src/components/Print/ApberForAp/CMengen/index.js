// @flow
import React from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import uniqBy from 'lodash/uniqBy'
import min from 'lodash/min'
import flatten from 'lodash/flatten'
import groupBy from 'lodash/groupBy'
import maxBy from 'lodash/maxBy'
import { useQuery } from 'react-apollo-hooks'
import { observer } from 'mobx-react-lite'

import query from './query'

const Container = styled.div`
  padding: 0.2cm 0;
  break-inside: avoid;
`
const Title = styled.h3`
  font-size: 16px;
  font-weight: 800;
  margin-bottom: 0;
`
const Row = styled.div`
  display: flex;
  padding: 0.05cm 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1) !important;
`
const YearRow = styled.div`
  display: flex;
  padding: 0.05cm 0;
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
const Label2Davon = styled.div`
  font-size: 10px;
  padding-left: 1.5cm;
  min-width: 0.8cm;
  max-width: 0.8cm;
  top: 3px;
  position: relative;
  color: grey;
`
const Label3 = styled.div`
  min-width: 7.5cm;
  max-width: 7.5cm;
  padding-left: 2.5cm;
`
const Label3AfterDavon = styled.div`
  padding-left: 0.2cm;
  min-width: 7.5cm;
  max-width: 7.5cm;
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
}: {
  apId: String,
  jahr: Number,
  startJahr: Number,
}) => {
  const { data, error, loading } = useQuery(query, {
    variables: { apId, jahr },
  })
  const oneLTpop_pop = get(data, 'apById.oneLTpop.nodes', [])
  const oneLTpop_tpop = flatten(
    oneLTpop_pop.map(p => get(p, 'tpopsByPopId.nodes', [])),
  ).filter(p => get(p, 'tpopmassnsByTpopId.totalCount', 0) > 0)
  const oneLTpop = oneLTpop_tpop.length
  const oneLPop = uniqBy(oneLTpop_tpop, 'popId').length

  const oneRTpop_pop = get(data, 'apById.oneRTpop.nodes', [])
  const oneRTpop_tpop = flatten(
    oneRTpop_pop.map(p => get(p, 'tpopsByPopId.nodes', [])),
  )
  const massns = flatten(
    oneRTpop_tpop.map(p => get(p, 'tpopmassnsByTpopId.nodes', [])),
  )
  const massnbers = flatten(
    oneRTpop_tpop.map(p => get(p, 'tpopmassnbersByTpopId.nodes', [])),
  )
  const oneRTpop_firstYear = min(massns.map(b => b.jahr))
  const oneRPop_massnbersByPopId = groupBy(massnbers, b =>
    get(b, 'tpopByTpopId.popId'),
  )
  const oneRPop_lastMassnbersByPopId = Object.keys(
    oneRPop_massnbersByPopId,
  ).map(b => maxBy(oneRPop_massnbersByPopId[b], 'jahr'))
  const oneRPop_massnbersByTpopId = groupBy(massnbers, b =>
    get(b, 'tpopByTpopId.id'),
  )
  const oneRPop_lastMassnbersByTpopId = Object.keys(
    oneRPop_massnbersByTpopId,
  ).map(b => maxBy(oneRPop_massnbersByTpopId[b], 'jahr'))

  // 1.
  const oneRPop = uniqBy(massns, b => get(b, 'tpopByTpopId.popId')).length
  const oneRTpop = uniqBy(massns, b => get(b, 'tpopByTpopId.id')).length

  // 2.
  const twoRPop = uniqBy(massnbers, b => get(b, 'tpopByTpopId.popId')).length
  const twoRTpop = uniqBy(massnbers, b => get(b, 'tpopByTpopId.id')).length

  // 3.
  const threeRPop = oneRPop_lastMassnbersByPopId.filter(
    b => b.beurteilung === 1,
  ).length
  const threeRTpop = oneRPop_lastMassnbersByTpopId.filter(
    b => b.beurteilung === 1,
  ).length

  // 4.
  const fourRPop = oneRPop_lastMassnbersByPopId.filter(b => b.beurteilung === 2)
    .length
  const fourRTpop = oneRPop_lastMassnbersByTpopId.filter(
    b => b.beurteilung === 2,
  ).length

  // 5.
  const fiveRPop = oneRPop_lastMassnbersByPopId.filter(b => b.beurteilung === 3)
    .length
  const fiveRTpop = oneRPop_lastMassnbersByTpopId.filter(
    b => b.beurteilung === 3,
  ).length

  // 6.
  const sixRPop = oneRPop_lastMassnbersByPopId.filter(b => b.beurteilung === 4)
    .length
  const sixRTpop = oneRPop_lastMassnbersByTpopId.filter(
    b => b.beurteilung === 4,
  ).length

  // 7.
  const sevenRPop = oneRPop_lastMassnbersByPopId.filter(
    b => b.beurteilung === 5,
  ).length
  const sevenRTpop = oneRPop_lastMassnbersByTpopId.filter(
    b => b.beurteilung === 5,
  ).length

  if (error) return `Fehler: ${error.message}`

  return (
    <Container>
      <Title>C. Zwischenbilanz zur Wirkung von Massnahmen</Title>
      <YearRow>
        <Year>{jahr}</Year>
        <YearSince>{`Seit ${loading ? '...' : oneRTpop_firstYear}`}</YearSince>
      </YearRow>
      <LabelRow>
        <Label1 />
        <PopBerJahr>Pop</PopBerJahr>
        <TpopBerJahr>TPop</TpopBerJahr>
        <PopSeit>Pop</PopSeit>
        <TpopSeit>TPop</TpopSeit>
      </LabelRow>
      <Row>
        <Label1>Anzahl Populationen/Teilpopulationen mit Massnahmen</Label1>
        <PopBerJahr>{loading ? '...' : oneLPop}</PopBerJahr>
        <TpopBerJahr>{loading ? '...' : oneLTpop}</TpopBerJahr>
        <PopSeit>{loading ? '...' : oneRPop}</PopSeit>
        <TpopSeit>{loading ? '...' : oneRTpop}</TpopSeit>
      </Row>
      <Row>
        <Label2>kontrolliert</Label2>
        <PopBerJahr />
        <TpopBerJahr />
        <PopSeit>{loading ? '...' : twoRPop}</PopSeit>
        <TpopSeit>{loading ? '...' : twoRTpop}</TpopSeit>
      </Row>
      <Row>
        <Label2Davon>davon:</Label2Davon>
        <Label3AfterDavon>sehr erfolgreich</Label3AfterDavon>
        <PopBerJahr />
        <TpopBerJahr />
        <PopSeit>{loading ? '...' : threeRPop}</PopSeit>
        <TpopSeit>{loading ? '...' : threeRTpop}</TpopSeit>
      </Row>
      <Row>
        <Label3>erfolgreich</Label3>
        <PopBerJahr />
        <TpopBerJahr />
        <PopSeit>{loading ? '...' : fourRPop}</PopSeit>
        <TpopSeit>{loading ? '...' : fourRTpop}</TpopSeit>
      </Row>
      <Row>
        <Label3>weniger erfolgreich</Label3>
        <PopBerJahr />
        <TpopBerJahr />
        <PopSeit>{loading ? '...' : fiveRPop}</PopSeit>
        <TpopSeit>{loading ? '...' : fiveRTpop}</TpopSeit>
      </Row>
      <Row>
        <Label3>nicht erfolgreich</Label3>
        <PopBerJahr />
        <TpopBerJahr />
        <PopSeit>{loading ? '...' : sixRPop}</PopSeit>
        <TpopSeit>{loading ? '...' : sixRTpop}</TpopSeit>
      </Row>
      <Row>
        <Label3>mit unsicherer Wirkung</Label3>
        <PopBerJahr />
        <TpopBerJahr />
        <PopSeit>{loading ? '...' : sevenRPop}</PopSeit>
        <TpopSeit>{loading ? '...' : sevenRTpop}</TpopSeit>
      </Row>
    </Container>
  )
}

export default observer(CMengen)
