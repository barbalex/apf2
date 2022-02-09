import React from 'react'
import styled from 'styled-components'
import { DateTime } from 'luxon'

const Container = styled.div`
  padding: 0.2cm 0;
  margin-bottom: 0.4cm;
  max-width: 18cm;
  font-size: 12px;
`
const Title = styled.div`
  border-bottom: 1px solid rgba(0, 0, 0, 0.1) !important;
  font-weight: 700;
  break-after: avoid;
  break-after: avoid;
  break-inside: avoid;
`
const Row = styled.div`
  display: flex;
  padding: 0.05cm 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1) !important;
`
const TitleRow = styled(Row)`
  display: flex;
  flex-direction: column;
  color: grey;
  max-width: 18cm;
  break-after: avoid;
  break-after: avoid;
  break-inside: avoid;
`
const TitleSubRow = styled.div`
  display: flex;
  max-width: 18cm;
`
const PopNr = styled.div`
  min-width: 0.6cm;
  max-width: 0.6cm;
  padding-right: 0.2cm;
`
const PopName = styled.div`
  min-width: 3.5cm;
  max-width: 3.5cm;
  padding-right: 0.2cm;
`
const PopNrName = styled.div`
  min-width: 4.1cm;
  max-width: 4.1cm;
  padding-right: 0.2cm;
`
const TpopNr = styled.div`
  min-width: 0.8cm;
  max-width: 0.8cm;
  padding-right: 0.2cm;
`
const TpopFlurname = styled.div`
  min-width: 3.5cm;
  max-width: 3.5cm;
  padding-right: 0.2cm;
`
const TpopNrFlurname = styled.div`
  min-width: 4.3cm;
  max-width: 4.3cm;
  padding-right: 0.2cm;
`
const MassnDatum = styled.div`
  min-width: 1cm;
  max-width: 1cm;
  padding-right: 0.2cm;
`
const MassnDatumTitle = styled.div`
  min-width: 1cm;
  max-width: 1cm;
  padding-right: 0.2cm;
  padding-top: 3px;
  font-size: 10px;
`
const MassnTyp = styled.div`
  min-width: 3.3cm;
  max-width: 3.3cm;
  padding-right: 0.2cm;
`
const MassnDatumTyp = styled.div`
  min-width: 4.3cm;
  max-width: 4.3cm;
  padding-right: 0.2cm;
`
const MassnBeschreibung = styled.div`
  width: 100%;
`

const Massnahmen = ({ massns }) => (
  <Container>
    <Title>Massnahmen im Berichtsjahr:</Title>
    <TitleRow>
      <TitleSubRow>
        <PopNrName>Population</PopNrName>
        <TpopNrFlurname>Teil-Population</TpopNrFlurname>
        <MassnDatumTyp>Massnahme</MassnDatumTyp>
        <MassnBeschreibung />
      </TitleSubRow>
      <TitleSubRow>
        <PopNr>Nr.</PopNr>
        <PopName>Name</PopName>
        <TpopNr>Nr.</TpopNr>
        <TpopFlurname>Flurname</TpopFlurname>
        <MassnDatumTitle>Datum</MassnDatumTitle>
        <MassnTyp>Typ</MassnTyp>
        <MassnBeschreibung>Massnahme</MassnBeschreibung>
      </TitleSubRow>
    </TitleRow>
    {massns.map((m) => {
      const mDatum = m.datum ? DateTime.fromSQL(m.datum).toFormat('dd.LL') : ''

      return (
        <Row key={m.id}>
          <PopNr>{m?.tpopByTpopId?.popByPopId?.nr ?? ''}</PopNr>
          <PopName>{m?.tpopByTpopId?.popByPopId?.name ?? ''}</PopName>
          <TpopNr>{m?.tpopByTpopId?.nr ?? ''}</TpopNr>
          <TpopFlurname>{m?.tpopByTpopId?.flurname ?? ''}</TpopFlurname>
          <MassnDatum>{mDatum}</MassnDatum>
          <MassnTyp>{m?.tpopmassnTypWerteByTyp?.text ?? ''}</MassnTyp>
          <MassnBeschreibung>{m?.beschreibung ?? ''}</MassnBeschreibung>
        </Row>
      )
    })}
  </Container>
)

export default Massnahmen
