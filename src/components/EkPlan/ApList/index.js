import React from 'react'
import styled from 'styled-components'

import Ap from './Ap'

const Container = styled.div`
  display: flex;
  flex-direction: column;
`

const ApList = ({ aps, removeAp }) => (
  <Container>
    {aps.map(ap => (
      <Ap key={ap.value} ap={ap} removeAp={removeAp} />
    ))}
  </Container>
)

export default ApList
