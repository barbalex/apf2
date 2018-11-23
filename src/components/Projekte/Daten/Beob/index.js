// @flow
import React, { useMemo, useContext } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import compose from 'recompose/compose'
import withProps from 'recompose/withProps'
import { observer } from 'mobx-react-lite'

import TextFieldNonUpdatable from '../../../shared/TextFieldNonUpdatable'
import constants from '../../../../modules/constants'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import withData from './withData'
import mobxStoreContext from '../../../../mobxStoreContext'

const Container = styled.div`
  padding: 15px 10px 0 10px;
  column-width: ${props =>
    props['data-width'] > 2 * constants.columnWidth
      ? `${constants.columnWidth}px`
      : 'auto'};
`

const enhance = compose(
  withProps(() => ({
    mobxStore: useContext(mobxStoreContext),
  })),
  withData,
  observer,
)

const Beob = ({
  data,
  dimensions = { width: 380 },
}: {
  dimensions: Object,
  data: Object,
}) => {
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
  if (data.loading) return <Container>Lade...</Container>
  if (data.error) return `Fehler: ${data.error.message}`

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

export default enhance(Beob)
