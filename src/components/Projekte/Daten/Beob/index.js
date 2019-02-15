// @flow
import React, { useMemo, useContext } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import { observer } from 'mobx-react-lite'
import { useQuery } from 'react-apollo-hooks'

import TextFieldNonUpdatable from '../../../shared/TextFieldNonUpdatable'
import constants from '../../../../modules/constants'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import query from './data'
import mobxStoreContext from '../../../../mobxStoreContext'

const Container = styled.div`
  padding: 15px 10px 0 10px;
  column-width: ${props =>
    props['data-width'] > 2 * constants.columnWidth
      ? `${constants.columnWidth}px`
      : 'auto'};
`

const Beob = ({
  dimensions = { width: 380 },
  treeName,
}: {
  dimensions: Object,
  treeName: string,
}) => {
  const mobxStore = useContext(mobxStoreContext)
  const { activeNodeArray } = mobxStore[treeName]
  const { data, loading, error } = useQuery(query, {
    variables: {
      id: activeNodeArray[activeNodeArray.length - 1],
    },
  })
  const row = get(data, 'beobById', {})
  const beobFields = useMemo(
    () =>
      Object.entries(JSON.parse(row.data)).filter(
        ([key, value]) => value || value === 0 || value === false,
      ),
    [row.data],
  )
  if (!row) return null
  if (!beobFields || beobFields.length === 0) return null
  if (loading) return <Container>Lade...</Container>
  if (error) return `Fehler: ${error.message}`

  return (
    <ErrorBoundary>
      <div>
        <Container
          data-width={isNaN(dimensions.width) ? 380 : dimensions.width}
        >
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
