import React from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'

const Container = styled.div`
  padding: 0.2cm 0;
  break-inside: avoid;
`
const Title = styled.h3`
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 0;
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
const Label2 = styled.div`
  min-width: 10cm;
  max-width: 10cm;
  padding-left: 1.2cm;
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

const CMengen = ({ apId, jahr, startJahr, loading, node }) => {
  const c1LPop = node?.c1LPop
  const c1LTpop = node?.c1LTpop
  const c1RPop = node?.c1RPop
  const c1RTpop = node?.c1RTpop
  const c2RPop = node?.c2RPop
  const c2RTpop = node?.c2RTpop
  const c3RPop = node?.c3RPop
  const c3RTpop = node?.c3RTpop
  const c4RPop = node?.c4RPop
  const c4RTpop = node?.c4RTpop
  const c5RPop = node?.c5RPop
  const c5RTpop = node?.c5RTpop
  const c6RPop = node?.c6RPop
  const c6RTpop = node?.c6RTpop
  const c7RPop = node?.c7RPop
  const c7RTpop = node?.c7RTpop
  const c1FirstYear = node?.c1FirstYear

  return (
    <Container>
      <Title>C. Zwischenbilanz zur Wirkung von Massnahmen</Title>
      <YearRow>
        <Year>{jahr}</Year>
        <YearSince>{`Seit ${loading ? '...' : c1FirstYear}`}</YearSince>
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
        <PopBerJahr>{loading ? '...' : c1LPop}</PopBerJahr>
        <TpopBerJahr>{loading ? '...' : c1LTpop}</TpopBerJahr>
        <PopSeit>{loading ? '...' : c1RPop}</PopSeit>
        <TpopSeit>{loading ? '...' : c1RTpop}</TpopSeit>
      </Row>
      <Row>
        <Label2>kontrolliert</Label2>
        <PopBerJahr />
        <TpopBerJahr />
        <PopSeit>{loading ? '...' : c2RPop}</PopSeit>
        <TpopSeit>{loading ? '...' : c2RTpop}</TpopSeit>
      </Row>
      <Row>
        <Label2Davon>davon:</Label2Davon>
        <Label2AfterDavon>sehr erfolgreich</Label2AfterDavon>
        <PopBerJahr />
        <TpopBerJahr />
        <PopSeit>{loading ? '...' : c3RPop}</PopSeit>
        <TpopSeit>{loading ? '...' : c3RTpop}</TpopSeit>
      </Row>
      <Row>
        <Label3>erfolgreich</Label3>
        <PopBerJahr />
        <TpopBerJahr />
        <PopSeit>{loading ? '...' : c4RPop}</PopSeit>
        <TpopSeit>{loading ? '...' : c4RTpop}</TpopSeit>
      </Row>
      <Row>
        <Label3>weniger erfolgreich</Label3>
        <PopBerJahr />
        <TpopBerJahr />
        <PopSeit>{loading ? '...' : c5RPop}</PopSeit>
        <TpopSeit>{loading ? '...' : c5RTpop}</TpopSeit>
      </Row>
      <Row>
        <Label3>nicht erfolgreich</Label3>
        <PopBerJahr />
        <TpopBerJahr />
        <PopSeit>{loading ? '...' : c6RPop}</PopSeit>
        <TpopSeit>{loading ? '...' : c6RTpop}</TpopSeit>
      </Row>
      <Row>
        <Label3>mit unsicherer Wirkung</Label3>
        <PopBerJahr />
        <TpopBerJahr />
        <PopSeit>{loading ? '...' : c7RPop}</PopSeit>
        <TpopSeit>{loading ? '...' : c7RTpop}</TpopSeit>
      </Row>
    </Container>
  )
}

export default observer(CMengen)
