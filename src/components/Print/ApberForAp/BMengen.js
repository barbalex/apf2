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

  const b1LPop = data?.jberAbc?.nodes?.[0]?.b1LPop
  const b1LTpop = data?.jberAbc?.nodes?.[0]?.b1LTpop
  const b1RPop = data?.jberAbc?.nodes?.[0]?.b1RPop
  const b1RTpop = data?.jberAbc?.nodes?.[0]?.b1RTpop
  const b1FirstYear = data?.jberAbc?.nodes?.[0]?.b1FirstYear

  if (error) return `Fehler beim Laden der Daten: ${error.message}`

  return (
    <Container>
      <Title>B. Bestandesentwicklung</Title>
      <YearRow>
        <Year>{jahr}</Year>
        <YearSince>{`Seit ${loading ? '...' : b1FirstYear}`}</YearSince>
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
