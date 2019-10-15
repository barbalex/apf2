import React, { useContext } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { useQuery } from '@apollo/react-hooks'
import ErrorBoundary from 'react-error-boundary'

import FormTitle from '../../../../shared/FormTitle'
import query from './query'
import storeContext from '../../../../../storeContext'

const Container = styled.div`
  height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
`
const FieldsContainer = styled.div`
  padding: 10px;
  overflow: auto !important;
  height: 100%;
`

const Qk = ({ treeName }) => {
  const store = useContext(storeContext)

  const { data, error, loading } = useQuery(query)

  if (error) return `Fehler: ${error.message}`
  return (
    <ErrorBoundary>
      <Container>
        <FormTitle title="Qualitätskontrollen" />
        <FieldsContainer>TODO</FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(Qk)
