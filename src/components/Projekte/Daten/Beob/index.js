import React, { useContext } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import { observer } from 'mobx-react-lite'
import { useQuery } from '@apollo/client'
import { withResizeDetector } from 'react-resize-detector'

import TextFieldNonUpdatable from '../../../shared/TextFieldNonUpdatable'
import constants from '../../../../modules/constants'
import query from './query'
import storeContext from '../../../../storeContext'
import ErrorBoundary from '../../../shared/ErrorBoundary'

const Container = styled.div`
  padding: 15px 10px 0 10px;
  ${(props) =>
    props['data-column-width'] &&
    `column-width: ${props['data-column-width']}px;`}
`
const LoadingContainer = styled.div`
  padding: 10px;
`

const Beob = ({ treeName, width = 1000 }) => {
  const store = useContext(storeContext)
  const { activeNodeArray } = store[treeName]
  const { data, loading, error } = useQuery(query, {
    variables: {
      id: activeNodeArray[activeNodeArray.length - 1],
    },
  })
  const row = get(data, 'beobById', {})
  const beobFields = row.data
    ? Object.entries(JSON.parse(row.data)).filter(
        ([key, value]) => value || value === 0 || value === false,
      )
    : []

  const columnWidth =
    width > 2 * constants.columnWidth ? constants.columnWidth : undefined

  if (!row) return null
  if (!beobFields || beobFields.length === 0) return null
  if (loading) {
    return <LoadingContainer>Lade...</LoadingContainer>
  }
  if (error) {
    return (
      <LoadingContainer>{`Fehler beim Laden der Daten: ${error.message}`}</LoadingContainer>
    )
  }

  return (
    <ErrorBoundary>
      <div>
        <Container data-column-width={columnWidth}>
          {beobFields.map(([key, value]) => (
            <div key={key}>
              <TextFieldNonUpdatable label={key} value={value} />
            </div>
          ))}
        </Container>
      </div>
    </ErrorBoundary>
  )
}

export default withResizeDetector(observer(Beob))
