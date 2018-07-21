// @flow
import React from 'react'
import styled from 'styled-components'

const Area = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.5);
  border-radius: 6px;
  padding: 10px;
  break-inside: avoid;
`
const Container = styled(Area)`
  grid-area: besttime;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-areas: 'besttimeLabel besttimeVal besttimeVal';
  align-items: center;
`
const Label = styled.div`
  font-weight: 700;
  padding-right: 4px;
`
const BesttimeLabel = styled(Label)`
  grid-area: besttimeLabel;
`
const BesttimeVal = styled.div`
  grid-area: besttimeVal;
`

const Besttime = ({
  saveToDb,
  errors,
  data,
  updateTpopkontr,
}: {
  saveToDb: () => void,
  errors: Object,
  data: Object,
  updateTpopkontr: () => void,
}) => {
  //const row = get(data, 'tpopkontrById')

  return (
    <Container>
      <BesttimeLabel>bester Beobachtungs-Zeitpunkt</BesttimeLabel>
      <BesttimeVal>August</BesttimeVal>
    </Container>
  )
}

export default Besttime
