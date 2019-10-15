import React, { useContext } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { useQuery } from '@apollo/react-hooks'
import ErrorBoundary from 'react-error-boundary'
import get from 'lodash/get'

import query from './query'
import storeContext from '../../../../../storeContext'

const Container = styled.div`
  height: calc(100vh - 64px - 43px - 48px);
  display: flex;
  flex-direction: column;
`
const FieldsContainer = styled.div`
  padding: 10px 0;
  overflow: auto !important;
  height: 100%;
`
const Row = styled.div`
  display: flex;
  padding: 10px;
  border-bottom: 1px solid #e8e8e8;
`
const Check = styled.div`
  padding-left: 5px;
  padding-right: 5px;
`
const Titel = styled.div`
  padding-left: 5px;
  padding-right: 5px;
`
const Beschreibung = styled.div`
  padding-left: 5px;
  padding-right: 5px;
`

const ChooseQk = ({ treeName }) => {
  const store = useContext(storeContext)
  const { activeNodeArray } = store[treeName]
  const apId = activeNodeArray[3]

  const { data, error, loading } = useQuery(query, { variables: { apId } })
  const rows = get(data, 'allQks.nodes')

  if (error) return `Fehler: ${error.message}`
  if (loading) return <Container>`Lade Daten...`</Container>
  return (
    <ErrorBoundary>
      <Container>
        <FieldsContainer>
          {rows.map(r => (
            <Row>
              <Check>TODO</Check>
              <Titel>{r.titel}</Titel>
              <Beschreibung>{r.beschreibung}</Beschreibung>
            </Row>
          ))}
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(ChooseQk)
