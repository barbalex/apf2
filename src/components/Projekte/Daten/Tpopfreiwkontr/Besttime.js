// @flow
import React from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import Measure from 'react-measure'

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
  grid-column-gap: 10px;
  align-items: center;
`
const Label = styled.div`
  font-weight: 700;
`
const BesttimeLabel = styled(Label)`
  grid-area: besttimeLabel;
`
const BesttimeVal = styled.div`
  grid-area: besttimeVal;
`

const Besttime = ({
  row,
  setBesttimeHeight,
}: {
  row: Object,
  setBesttimeHeight: () => void,
}) => {
  const bestTime = get(
    row,
    'tpopByTpopId.popByPopId.apByApId.ekfBeobachtungszeitpunkt',
    '',
  )

  return (
    <Measure
      bounds
      onResize={contentRect => {
        setBesttimeHeight(contentRect.bounds.height)
      }}
    >
      {({ measureRef }) => (
        <Container innerRef={measureRef}>
          <BesttimeLabel>bester Beobachtungs-Zeitpunkt</BesttimeLabel>
          <BesttimeVal>{bestTime}</BesttimeVal>
        </Container>
      )}
    </Measure>
  )
}

export default Besttime
