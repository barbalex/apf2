import React, { useContext } from 'react'
import { useQuery } from '@apollo/client'
import { observer } from 'mobx-react-lite'

import Polyline from './Polyline'
import storeContext from '../../../../../storeContext'
import query from './query'

const BeobZugeordnetAssignPolylines = () => {
  const store = useContext(storeContext)
  const { enqueNotification } = store
  const { beobGqlFilter } = store.tree

  var { data, error } = useQuery(query, {
    variables: { beobFilter: beobGqlFilter('zugeordnet').filtered },
  })

  if (error) {
    enqueNotification({
      message: `Fehler beim Laden der Populationen für die Karte: ${error.message}`,
      options: {
        variant: 'error',
      },
    })
  }

  return (data?.allBeobs?.nodes ?? []).map((beob) => (
    <Polyline key={beob.id} beob={beob} />
  ))
}

export default observer(BeobZugeordnetAssignPolylines)
