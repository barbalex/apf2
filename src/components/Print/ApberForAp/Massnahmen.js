// @flow
import React from 'react'
import styled from 'styled-components'
import get from 'lodash/get'

const Container = styled.div`
  padding: 0.2cm 0;
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
  color: grey;
`
const TitleSubRow = styled.div``
const PopNr = styled.div`
  width: 1cm;
  padding-right: 0.2cm;
`
const PopName = styled.div`
  width: 4cm;
  padding-right: 0.2cm;
`
const TpopNr = styled.div`
  width: 1cm;
  padding-right: 0.2cm;
`
const TpopFlurname = styled.div`
  width: 4cm;
  padding-right: 0.2cm;
`
const MassnBeschreibung = styled.div`
  width: 100%;
`

const Massnahmen = ({
  massns
}:{
  massns: Array<Object>
}) =>
  <Container>
    <Title>Massnahmen im Berichtsjahr:</Title>
    <TitleRow>
      <TitleSubRow>
        <PopNr>Pop</PopNr>
        <PopName>Pop</PopName>
        <TpopNr>Ziel</TpopNr>
        <TpopFlurname>TPop</TpopFlurname>
        <MassnBeschreibung>Massnahme</MassnBeschreibung>
      </TitleSubRow>
    </TitleRow>
    {
      massns.map(m =>
        <Row key={m.id}>
          <PopNr>{get(m, 'tpopByTpopId.popByPopId.nr', '')}</PopNr>
          <PopName>{get(m, 'tpopByTpopId.popByPopId.name', '')}</PopName>
          <TpopNr>{get(m, 'tpopByTpopId.nr', '')}</TpopNr>
          <TpopFlurname>{get(m, 'tpopByTpopId.flurname', '')}</TpopFlurname>
          <MassnBeschreibung>{get(m, 'beschreibung', '')}</MassnBeschreibung>
        </Row>
      )
    }
  </Container>
  

export default Massnahmen
