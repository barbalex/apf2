// @flow
import React from 'react'
import { observer, inject } from 'mobx-react'
import compose from 'recompose/compose'

import TextFieldNonUpdatable from '../../shared/TextFieldNonUpdatable'

const enhance = compose(inject(`store`), observer)

const Beob = ({ store, tree }: { store: Object, tree: Object }) => {
  const { row } = tree.activeDataset
  const beob = store.table.beob.get(row.BeobId || row.id)
  if (!beob) return null
  const beobFields = Object.entries(beob.data).filter(
    ([key, value]) => value || value === 0,
  )

  return (
    <div>
      {beobFields.map(([key, value]) => (
        <div key={key}>
          <TextFieldNonUpdatable label={key} value={value} />
        </div>
      ))}
    </div>
  )
}

export default enhance(Beob)
