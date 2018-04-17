// @flow
import React from 'react'
import { observer, inject } from 'mobx-react'
import compose from 'recompose/compose'
import styled from 'styled-components'

import TextFieldNonUpdatable from '../../shared/TextFieldNonUpdatable'
import constants from '../../../modules/constants'
import ErrorBoundary from '../../shared/ErrorBoundary'

const Container = styled.div`
  padding: 0 10px 0 10px;
  column-width: ${props =>
    props['data-width'] > 2 * constants.columnWidth
      ? `${constants.columnWidth}px`
      : 'auto'};
`

const enhance = compose(inject('store'), observer)

const Beob = ({
  store,
  tree,
  dimensions = { width: 380 },
}: {
  store: Object,
  tree: Object,
  dimensions: Object,
}) => {
  const { row } = tree.activeDataset
  const width = isNaN(dimensions.width) ? 380 : dimensions.width
  const beob = store.table.beob.get(row.id || row.beob_id)
  if (!beob) return null
  const beobFields = Object.entries(beob.data).filter(
    ([key, value]) => value || value === 0
  )

  return (
    <ErrorBoundary>
      <div ref={c => (this.container = c)}>
        <Container data-width={width}>
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
