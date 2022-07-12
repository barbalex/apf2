import React, { useContext } from 'react'
import { useQuery } from '@apollo/client'
import { observer } from 'mobx-react-lite'

import Polyline from './Polyline'
import storeContext from '../../../../../storeContext'
import query from './query'

const BeobZugeordnetAssignPolylines = ({ treeName }) => {
  const store = useContext(storeContext)
  const { setRefetchKey, enqueNotification } = store
  const { beobGqlFilter } = store[treeName]

  var { data, error, refetch } = useQuery(query, {
    variables: { beobFilter: beobGqlFilter('zugeordnet').filtered },
  })
  setRefetchKey({ key: 'beobAssignLines', value: refetch })

  if (error) {
    enqueNotification({
      message: `Fehler beim Laden der Populationen für die Karte: ${error.message}`,
      options: {
        variant: 'error',
      },
    })
  }

  return (data?.allBeobs?.nodes ?? []).map((beob) => (
    <Polyline key={beob.id} beob={beob} treeName={treeName} />
  ))
}

export default observer(BeobZugeordnetAssignPolylines)
