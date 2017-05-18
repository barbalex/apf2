// @flow
import React from 'react'
import { observer, inject } from 'mobx-react'
import compose from 'recompose/compose'
import styled from 'styled-components'

import TextFieldNonUpdatable from '../../shared/TextFieldNonUpdatable'
import constants from '../../../modules/constants'

const Container = styled.div`
  padding: 0 10px 0 10px;
  column-width: ${constants.columnWidth}px;
`

const enhance = compose(inject('store'), observer)

const Beob = ({ store, tree }: { store: Object, tree: Object }) => {
  const { row } = tree.activeDataset
  const beob = store.table.beob.get(row.BeobId || row.id)
  if (!beob) return null
  const beobFields = Object.entries(beob.data).filter(
    ([key, value]) => value || value === 0,
  )

  return (
    <Container>
      {beobFields.map(([key, value]) => (
        <div key={key}>
          <TextFieldNonUpdatable label={key} value={value} />
        </div>
      ))}
    </Container>
  )
}

export default enhance(Beob)
