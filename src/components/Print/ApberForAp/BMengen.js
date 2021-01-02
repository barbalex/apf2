import React from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import min from 'lodash/min'

const Container = styled.div`
  padding: 0.2cm 0;
  break-inside: avoid;
`
const Title = styled.h3`
  font-size: 16px;
  font-weight: 700;
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

const BMengen = ({ jahr, mengenResult }) => {
  const { data, error, loading } = mengenResult

  const b1LPop_pop = get(data, 'apById.b1LPop.nodes', []).filter(
    (p) => get(p, 'popbersByPopId.totalCount') > 0,
  )
  const b1LPop = b1LPop_pop.length

  const b1LTpop_pop = get(data, 'apById.b1LTpop.nodes', [])
  const b1LTpop_tpop = b1LTpop_pop.flatMap((p) =>
    get(p, 'tpopsByPopId.nodes', []),
  )

  const b1LTpop = b1LTpop_tpop
    .flatMap((p) => get(p, 'tpopbersByTpopId.totalCount', 0))
    .filter((tpopbersCount) => tpopbersCount > 0).length

  const b1RPop = get(data, 'apById.b1RPop.nodes', []).filter(
    (p) => get(p, 'popbersByPopId.totalCount') > 0,
  ).length

  const b1RTpop_pop = get(data, 'apById.b1RTpop.nodes', [])
  const b1RTpop_tpop = b1RTpop_pop.flatMap((p) =>
    get(p, 'tpopsByPopId.nodes', []),
  )

  const b1RTpop = b1RTpop_tpop
    .flatMap((p) => get(p, 'tpopbersByTpopId.totalCount', 0))
    .filter((tpopbersCount) => tpopbersCount > 0).length
  const b1RTpop_tpopbers = b1RTpop_tpop.flatMap((p) =>
    get(p, 'tpopbersByTpopId.nodes', []),
  )

  const b1RTpop_firstYear = min(b1RTpop_tpopbers.map((b) => b.jahr))

  if (error) return `Fehler beim Laden der Daten: ${error.message}`

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
    </Container>
  )
}

export default BMengen
