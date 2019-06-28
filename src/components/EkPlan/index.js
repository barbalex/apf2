import React, { useState } from 'react'
import { useQuery } from 'react-apollo-hooks'
import styled from 'styled-components'

import queryApsToChoose from './queryApsToChoose'

const Container = styled.div`
  height: calc(100vh - 64px);
`

const EkPlan = () => {
  const [aps, setAps] = useState([])
  const {
    data: dataApsToChoose,
    loading: loadingApsToChoose,
    error: errorApsToChoose,
  } = useQuery(queryApsToChoose, {
    variables: {
      aps,
    },
  })

  return (
    <Container>
      <div>Hier ist was im Aufbau</div>
    </Container>
  )
}

export default EkPlan
