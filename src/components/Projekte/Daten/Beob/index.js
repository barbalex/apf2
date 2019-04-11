// @flow
import React, { useContext } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import { observer } from 'mobx-react-lite'
import { useQuery } from 'react-apollo-hooks'

import TextFieldNonUpdatable from '../../../shared/TextFieldNonUpdatable'
import constants from '../../../../modules/constants'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import query from './query'
import storeContext from '../../../../storeContext'

const Container = styled.div`
  padding: 15px 10px 0 10px;
  column-width: ${props =>
    props['data-width'] > 2 * constants.columnWidth
      ? `${constants.columnWidth}px`
      : 'auto'};
`

const Beob = ({ treeName }: { treeName: string }) => {
  const store = useContext(storeContext)
  const { activeNodeArray, datenWidth } = store[treeName]
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

  if (!row) return null
  if (!beobFields || beobFields.length === 0) return null
  if (loading) return <Container>Lade...</Container>
  if (error) return `Fehler: ${error.message}`

  return (
    <ErrorBoundary>
      <div>
        <Container data-width={datenWidth}>
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

export default observer(Beob)
