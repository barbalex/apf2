// @flow
import React from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import format from 'date-fns/format'

const Container = styled.div`
  padding: 0.2cm 0;
  max-width: 18cm;
  font-size: 12px;
`
const Title = styled.div`
  border-bottom: 1px solid rgba(0, 0, 0, 0.1) !important;
  font-weight: 600;
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
const MassnDatum = styled.div`
  min-width: 1cm;
  max-width: 1cm;
  padding-right: 0.2cm;
`
const MassnTyp = styled.div`
  min-width: 3.3cm;
  max-width: 3.3cm;
  padding-right: 0.2cm;
`
const MassnBeschreibung = styled.div`
  width: 100%;
`

const Massnahmen = ({ massns }: { massns: Array<Object> }) => (
  <Container>
    <Title>Massnahmen im Berichtsjahr:</Title>
    <TitleRow>
      <TitleSubRow>
        <PopNr>Pop</PopNr>
        <PopName>Pop</PopName>
        <TpopNr>TPop</TpopNr>
        <TpopFlurname>TPop</TpopFlurname>
        <MassnDatum>Massn</MassnDatum>
        <MassnTyp>Massn</MassnTyp>
        <MassnBeschreibung />
      </TitleSubRow>
      <TitleSubRow>
        <PopNr>Nr.</PopNr>
        <PopName>Name</PopName>
        <TpopNr>Nr.</TpopNr>
        <TpopFlurname>Flurname</TpopFlurname>
        <MassnDatum>Datum</MassnDatum>
        <MassnTyp>Typ</MassnTyp>
        <MassnBeschreibung>Massnahme</MassnBeschreibung>
      </TitleSubRow>
    </TitleRow>
    {massns.map(m => {
      const mDatum = m.datum ? format(new Date(m.datum), 'dd.MM') : ''
      return (
        <Row key={m.id}>
          <PopNr>{get(m, 'tpopByTpopId.popByPopId.nr', '')}</PopNr>
          <PopName>{get(m, 'tpopByTpopId.popByPopId.name', '')}</PopName>
          <TpopNr>{get(m, 'tpopByTpopId.nr', '')}</TpopNr>
          <TpopFlurname>{get(m, 'tpopByTpopId.flurname', '')}</TpopFlurname>
          <MassnDatum>{mDatum}</MassnDatum>
          <MassnTyp>{get(m, 'tpopmassnTypWerteByTyp.text', '')}</MassnTyp>
          <MassnBeschreibung>{get(m, 'beschreibung', '')}</MassnBeschreibung>
        </Row>
      )
    })}
  </Container>
)

export default Massnahmen
