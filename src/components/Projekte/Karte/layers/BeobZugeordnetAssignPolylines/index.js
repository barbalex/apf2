import React, { useContext, useMemo } from 'react'
import get from 'lodash/get'
import flatten from 'lodash/flatten'
import { useQuery } from '@apollo/client'
import { observer } from 'mobx-react-lite'

import Polyline from './Polyline'
import storeContext from '../../../../../storeContext'
import query from './query'

const BeobZugeordnetAssignPolylines = ({ treeName }) => {
  const store = useContext(storeContext)
  const { setRefetchKey, enqueNotification, activeApfloraLayers } = store
  const tree = store[treeName]
  const { projIdInActiveNodeArray, apIdInActiveNodeArray } = tree

  const projId =
    projIdInActiveNodeArray || '99999999-9999-9999-9999-999999999999'
  const apId = apIdInActiveNodeArray || '99999999-9999-9999-9999-999999999999'
  const isActiveInMap = activeApfloraLayers.includes(
    'beobZugeordnetAssignPolylines',
  )

  const beobFilter = {
    tpopId: { isNull: false },
    nichtZuordnen: { equalTo: false },
    wgs84Lat: { isNull: false },
  }
  if (!!tree.nodeLabelFilter.beob) {
    beobFilter.label = {
      includesInsensitive: tree.nodeLabelFilter.beob,
    }
  }
  var { data, error, refetch } = useQuery(query, {
    variables: { projId, apId, isActiveInMap, beobFilter },
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

  const aparts = get(
    data,
    'projektById.apsByProjId.nodes[0].apartsByApId.nodes',
    [],
  )
  const beobs = useMemo(
    () =>
      flatten(
        aparts.map((a) => get(a, 'aeTaxonomyByArtId.beobsByArtId.nodes', [])),
      ),
    [aparts],
  )

  return beobs.map((beob) => (
    <Polyline key={beob.id} beob={beob} treeName={treeName} />
  ))
}

export default observer(BeobZugeordnetAssignPolylines)
