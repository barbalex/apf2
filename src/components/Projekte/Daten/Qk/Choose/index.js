import React, { useContext } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { useQuery } from '@apollo/react-hooks'
import ErrorBoundary from 'react-error-boundary'

import query from './query'
import storeContext from '../../../../../storeContext'

const Container = styled.div`
  height: calc(100vh - 64px - 43px - 48px);
  display: flex;
  flex-direction: column;
`
const FieldsContainer = styled.div`
  padding: 10px;
  overflow: auto !important;
  height: 100%;
`

const ChooseQk = ({ treeName }) => {
  const store = useContext(storeContext)
  const { activeNodeArray } = store[treeName]
  const apId = activeNodeArray[3]

  const { data, error, loading } = useQuery(query, { variables: { apId } })

  if (error) return `Fehler: ${error.message}`
  if (loading) return <Container>`Lade Daten...`</Container>
  return (
    <ErrorBoundary>
      <Container>
        <FieldsContainer>
          Hier soll man bald Qualitäts-Kontrollen auswählen können
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(ChooseQk)
