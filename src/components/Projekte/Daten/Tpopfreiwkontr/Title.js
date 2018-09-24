// @flow
import React from 'react'
import styled from 'styled-components'
import Measure from 'react-measure'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'

const Area = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.5);
  border-radius: 6px;
  padding: 10px;
  break-inside: avoid;
`
const Container = styled(Area)`
  grid-area: title;
  font-weight: 700;
  font-size: 22px;
  @media print {
    font-size: 16px;
  }
`

const enhance = compose(
  withHandlers({
    onResize: ({ setTitleHeight }) => contentRect => {
      setTitleHeight(contentRect.bounds.height)
    },
  }),
)

const Title = ({ onResize }: { onResize: () => void }) => {
  return (
    <Measure bounds onResize={onResize}>
      {({ measureRef }) => (
        <Container innerRef={measureRef}>
          Erfolgskontrolle Artenschutz Flora
        </Container>
      )}
    </Measure>
  )
}

export default enhance(Title)
