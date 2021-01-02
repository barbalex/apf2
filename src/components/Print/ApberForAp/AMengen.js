import React from 'react'
import styled from 'styled-components'

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
const TotalRow = styled(Row)`
  font-weight: 700;
`
const FernerRow = styled.div`
  padding: 0.05cm 0 0 0;
  font-size: 12px;
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
  min-width: 1.2cm;
  max-width: 1.2cm;
  text-align: right;
`
const PopBerJahr = styled(Number)``
const TpopBerJahr = styled(Number)``
const PopSeit = styled(Number)`
  margin-left: 1cm;
`
const TpopSeit = styled(Number)``

const AMengen = ({
  loading,
  jahr,
  a1LPop,
  a1LTpop,
  a2LPop,
  a2LTpop,
  a3LPop,
  a3LTpop,
  a4LPop,
  a4LTpop,
  a5LPop,
  a5LTpop,
  a6LPop,
  a6LTpop,
  a7LPop,
  a7LTpop,
  a8LPop,
  a8LTpop,
  a9LPop,
  a9LTpop,
  a10LPop,
  a10LTpop,
}) => (
  <Container>
    <Title>A. Grundmengen</Title>
    <YearRow>
      <Year>{jahr}</Year>
    </YearRow>
    <LabelRow>
      <Label1 />
      <PopBerJahr>Pop</PopBerJahr>
      <TpopBerJahr>TPop</TpopBerJahr>
      <PopSeit />
      <TpopSeit />
    </LabelRow>
    <Row>
      <Label1>Anzahl bekannt</Label1>
      <PopBerJahr>{loading ? '...' : a1LPop}</PopBerJahr>
      <TpopBerJahr>{loading ? '...' : a1LTpop}</TpopBerJahr>
      <PopSeit />
      <TpopSeit />
    </Row>
    <TotalRow>
      <Label2>aktuell</Label2>
      <PopBerJahr>{loading ? '...' : a2LPop}</PopBerJahr>
      <TpopBerJahr>{loading ? '...' : a2LTpop}</TpopBerJahr>
      <PopSeit />
      <TpopSeit />
    </TotalRow>
    <Row>
      <Label2Davon>davon:</Label2Davon>
      <Label2AfterDavon>ursprünglich</Label2AfterDavon>
      <PopBerJahr>{loading ? '...' : a3LPop}</PopBerJahr>
      <TpopBerJahr>{loading ? '...' : a3LTpop}</TpopBerJahr>
      <PopSeit />
      <TpopSeit />
    </Row>
    <Row>
      <Label3>angesiedelt (vor Beginn AP)</Label3>
      <PopBerJahr>{loading ? '...' : a4LPop}</PopBerJahr>
      <TpopBerJahr>{loading ? '...' : a4LTpop}</TpopBerJahr>
      <PopSeit />
      <TpopSeit />
    </Row>
    <Row>
      <Label3>angesiedelt (nach Beginn AP)</Label3>
      <PopBerJahr>{loading ? '...' : a5LPop}</PopBerJahr>
      <TpopBerJahr>{loading ? '...' : a5LTpop}</TpopBerJahr>
      <PopSeit />
      <TpopSeit />
    </Row>
    <Row>
      <Label2>erloschen (nach 1950):</Label2>
      <PopBerJahr>{loading ? '...' : a6LPop}</PopBerJahr>
      <TpopBerJahr>{loading ? '...' : a6LTpop}</TpopBerJahr>
      <PopSeit />
      <TpopSeit />
    </Row>
    <Row>
      <Label2Davon>davon:</Label2Davon>
      <Label2AfterDavon>
        zuvor autochthon oder vor AP angesiedelt
      </Label2AfterDavon>
      <PopBerJahr>{loading ? '...' : a7LPop}</PopBerJahr>
      <TpopBerJahr>{loading ? '...' : a7LTpop}</TpopBerJahr>
      <PopSeit />
      <TpopSeit />
    </Row>
    <Row>
      <Label3>nach Beginn Aktionsplan angesiedelt</Label3>
      <PopBerJahr>{loading ? '...' : a8LPop}</PopBerJahr>
      <TpopBerJahr>{loading ? '...' : a8LTpop}</TpopBerJahr>
      <PopSeit />
      <TpopSeit />
    </Row>
    <Row>
      <Label2>Ansaatversuche:</Label2>
      <PopBerJahr>{loading ? '...' : a9LPop}</PopBerJahr>
      <TpopBerJahr>{loading ? '...' : a9LTpop}</TpopBerJahr>
      <PopSeit />
      <TpopSeit />
    </Row>
    <FernerRow>ferner:</FernerRow>
    <Row>
      <Label1>potentieller Wuchs-/Ansiedlungsort:</Label1>
      <PopBerJahr>{loading ? '...' : a10LPop}</PopBerJahr>
      <TpopBerJahr>{loading ? '...' : a10LTpop}</TpopBerJahr>
      <PopSeit />
      <TpopSeit />
    </Row>
  </Container>
)

export default AMengen
