import React from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import min from 'lodash/min'
import maxBy from 'lodash/maxBy'
import groupBy from 'lodash/groupBy'

const Container = styled.div`
  padding: 0.2cm 0;
  break-inside: avoid;
`
const Title = styled.h3`
  font-size: 16px;
  font-weight: 800;
  margin-bottom: -18px;
`
const Row = styled.div`
  display: flex;
  padding: 0.05cm 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1) !important;
  page-break-inside: avoid;
`
const YearRow = styled.div`
  display: flex;
  padding: 0.05cm 0;
`
const NkRow = styled(Row)`
  padding: 0.3cm 0 0.05cm 0;
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
const Label2Davon = styled.div`
  font-size: 10px;
  text-align: right;
  padding-left: 1.2cm;
  min-width: 2cm;
  max-width: 2cm;
  top: 3px;
  position: relative;
  color: grey;
`
const Label2AfterDavon = styled.div`
  padding-left: 1cm;
  min-width: 8cm;
  max-width: 8cm;
`
const Label3 = styled.div`
  min-width: 10cm;
  max-width: 10cm;
  padding-left: 3cm;
`
const Number = styled.div`
  min-width: 1cm;
  max-width: 1cm;
  text-align: right;
`
const PopBerJahr = styled(Number)``
const TpopBerJahr = styled(Number)``
const PopSeit = styled(Number)`
  margin-left: 1cm;
`
const TpopSeit = styled(Number)``

const BMengen = ({ apId, jahr, startJahr, mengenResult, a1LPop, a1LTpop }) => {
  const { data, error, loading } = mengenResult
  // 1.
  const b1LPop_pop = get(data, 'apById.b1LPop.nodes', []).filter(
    p => get(p, 'popbersByPopId.totalCount') > 0,
  )
  const b1LPop = b1LPop_pop.length
  const b1LPop_popbers = b1LPop_pop.flatMap(p =>
    get(p, 'popbersByPopId.nodes', []),
  )

  const b1LTpop_pop = get(data, 'apById.b1LTpop.nodes', [])
  const b1LTpop_tpop = b1LTpop_pop.flatMap(p =>
    get(p, 'tpopsByPopId.nodes', []),
  )

  const b1LTpop = b1LTpop_tpop
    .flatMap(p => get(p, 'tpopbersByTpopId.totalCount', 0))
    .filter(tpopbersCount => tpopbersCount > 0).length
  const b1LTpop_tpopbers = b1LTpop_tpop.flatMap(t =>
    get(t, 'tpopbersByTpopId.nodes', []),
  )

  const b1RPop = get(data, 'apById.b1RPop.nodes', []).filter(
    p => get(p, 'popbersByPopId.totalCount') > 0,
  ).length
  const b1RPop_pop = get(data, 'apById.b1RPop.nodes', [])
  const b1RPop_popbers = b1RPop_pop.flatMap(p =>
    get(p, 'popbersByPopId.nodes', []),
  )

  const b1RPop_popbersByPopId = groupBy(b1RPop_popbers, b => b.popId)
  const b1RPop_lastPopbers = Object.keys(b1RPop_popbersByPopId).map(b =>
    maxBy(b1RPop_popbersByPopId[b], 'jahr'),
  )

  const b1RTpop_pop = get(data, 'apById.b1RTpop.nodes', [])
  const b1RTpop_tpop = b1RTpop_pop.flatMap(p =>
    get(p, 'tpopsByPopId.nodes', []),
  )

  const b1RTpop = b1RTpop_tpop
    .flatMap(p => get(p, 'tpopbersByTpopId.totalCount', 0))
    .filter(tpopbersCount => tpopbersCount > 0).length
  const b1RTpop_tpopbers = b1RTpop_tpop.flatMap(p =>
    get(p, 'tpopbersByTpopId.nodes', []),
  )

  const b1RTpop_tpopbersByTpopId = groupBy(b1RTpop_tpopbers, b => b.tpopId)
  const b1RTpop_lastTpopbers = Object.keys(b1RTpop_tpopbersByTpopId).map(b =>
    maxBy(b1RTpop_tpopbersByTpopId[b], 'jahr'),
  )
  const b1RTpop_firstYear = min(b1RTpop_tpopbers.map(b => b.jahr))

  // 2.
  const b2LPop = b1LPop_popbers.filter(b => b.entwicklung === 3).length
  const b2LTpop = b1LTpop_tpopbers.filter(b => b.entwicklung === 3).length
  const b2RPop = b1RPop_lastPopbers.filter(b => b.entwicklung === 3).length
  const b2RTpop = b1RTpop_lastTpopbers.filter(b => b.entwicklung === 3).length

  // 3.
  const b3LPop = b1LPop_popbers.filter(b => b.entwicklung === 2).length
  const b3LTpop = b1LTpop_tpopbers.filter(b => b.entwicklung === 2).length
  const b3RPop = b1RPop_lastPopbers.filter(b => b.entwicklung === 2).length
  const b3RTpop = b1RTpop_lastTpopbers.filter(b => b.entwicklung === 2).length

  // 4.
  const b4LPop = b1LPop_popbers.filter(b => b.entwicklung === 1).length
  const b4LTpop = b1LTpop_tpopbers.filter(b => b.entwicklung === 1).length
  const b4RPop = b1RPop_lastPopbers.filter(b => b.entwicklung === 1).length
  const b4RTpop = b1RTpop_lastTpopbers.filter(b => b.entwicklung === 1).length

  // 5.
  const b5LPop = b1LPop_popbers.filter(b => b.entwicklung === 4).length
  const b5LTpop = b1LTpop_tpopbers.filter(b => b.entwicklung === 4).length
  const b5RPop = b1RPop_lastPopbers.filter(b => b.entwicklung === 4).length
  const b5RTpop = b1RTpop_lastTpopbers.filter(b => b.entwicklung === 4).length

  // 6.
  const b6LPop = b1LPop_popbers.filter(b => b.entwicklung === 8).length
  const b6LTpop = b1LTpop_tpopbers.filter(b => b.entwicklung === 8).length
  const b6RPop = b1RPop_lastPopbers.filter(b => b.entwicklung === 8).length
  const b6RTpop = b1RTpop_lastTpopbers.filter(b => b.entwicklung === 8).length

  // 7.
  const b7LPop = a1LPop - b1LPop
  const b7LTpop = a1LTpop - b1LTpop
  const b7RPop = a1LPop - b1RPop
  const b7RTpop = a1LTpop - b1RTpop

  if (error) return `Fehler: ${error.message}`

  return (
    <Container>
      <Title>B. Bestandesentwicklung</Title>
      <YearRow>
        <Year>{jahr}</Year>
        <YearSince>{`Seit ${loading ? '...' : b1RTpop_firstYear}`}</YearSince>
      </YearRow>
      <LabelRow>
        <Label1 />
        <PopBerJahr>Pop</PopBerJahr>
        <TpopBerJahr>TPop</TpopBerJahr>
        <PopSeit>Pop</PopSeit>
        <TpopSeit>TPop</TpopSeit>
      </LabelRow>
      <Row>
        <Label1>kontrolliert (inkl. Ansaatversuche)</Label1>
        <PopBerJahr>{loading ? '...' : b1LPop}</PopBerJahr>
        <TpopBerJahr>{loading ? '...' : b1LTpop}</TpopBerJahr>
        <PopSeit>{loading ? '...' : b1RPop}</PopSeit>
        <TpopSeit>{loading ? '...' : b1RTpop}</TpopSeit>
      </Row>
      <Row>
        <Label2Davon>davon:</Label2Davon>
        <Label2AfterDavon>zunehmend</Label2AfterDavon>
        <PopBerJahr>{loading ? '...' : b2LPop}</PopBerJahr>
        <TpopBerJahr>{loading ? '...' : b2LTpop}</TpopBerJahr>
        <PopSeit>{loading ? '...' : b2RPop}</PopSeit>
        <TpopSeit>{loading ? '...' : b2RTpop}</TpopSeit>
      </Row>
      <Row>
        <Label3>stabil</Label3>
        <PopBerJahr>{loading ? '...' : b3LPop}</PopBerJahr>
        <TpopBerJahr>{loading ? '...' : b3LTpop}</TpopBerJahr>
        <PopSeit>{loading ? '...' : b3RPop}</PopSeit>
        <TpopSeit>{loading ? '...' : b3RTpop}</TpopSeit>
      </Row>
      <Row>
        <Label3>abnehmend</Label3>
        <PopBerJahr>{loading ? '...' : b4LPop}</PopBerJahr>
        <TpopBerJahr>{loading ? '...' : b4LTpop}</TpopBerJahr>
        <PopSeit>{loading ? '...' : b4RPop}</PopSeit>
        <TpopSeit>{loading ? '...' : b4RTpop}</TpopSeit>
      </Row>
      <Row>
        <Label3>unsicher</Label3>
        <PopBerJahr>{loading ? '...' : b5LPop}</PopBerJahr>
        <TpopBerJahr>{loading ? '...' : b5LTpop}</TpopBerJahr>
        <PopSeit>{loading ? '...' : b5RPop}</PopSeit>
        <TpopSeit>{loading ? '...' : b5RTpop}</TpopSeit>
      </Row>
      <Row>
        <Label3>erloschen</Label3>
        <PopBerJahr>{loading ? '...' : b6LPop}</PopBerJahr>
        <TpopBerJahr>{loading ? '...' : b6LTpop}</TpopBerJahr>
        <PopSeit>{loading ? '...' : b6RPop}</PopSeit>
        <TpopSeit>{loading ? '...' : b6RTpop}</TpopSeit>
      </Row>
      <NkRow>
        <Label1>nicht kontrolliert (inkl. Ansaatversuche)</Label1>
        <PopBerJahr>{loading ? '...' : b7LPop}</PopBerJahr>
        <TpopBerJahr>{loading ? '...' : b7LTpop}</TpopBerJahr>
        <PopSeit>{loading ? '...' : b7RPop}</PopSeit>
        <TpopSeit>{loading ? '...' : b7RTpop}</TpopSeit>
      </NkRow>
    </Container>
  )
}

export default BMengen
