import React from 'react'
import styled from 'styled-components'

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

const Title = ({ row }) => {
  const year = row?.jahr ?? new Date().getFullYear()

  return <Container>{`Erfolgskontrolle Artenschutz Flora ${year}`}</Container>
}

export default Title
