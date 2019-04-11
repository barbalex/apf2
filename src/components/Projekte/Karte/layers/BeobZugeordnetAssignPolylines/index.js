import React, { useContext, useMemo } from 'react'
import get from 'lodash/get'
import flatten from 'lodash/flatten'
import { useQuery } from 'react-apollo-hooks'
import { observer } from 'mobx-react-lite'

import Polyline from './Polyline'
import storeContext from '../../../../../storeContext'
import query from './query'

const BeobZugeordnetAssignPolylines = ({ treeName }) => {
  const store = useContext(storeContext)
  const { setRefetchKey, addError, activeApfloraLayers } = store
  const tree = store[treeName]

  const activeNodes = store[`${treeName}ActiveNodes`]
  const projId = activeNodes.projekt || '99999999-9999-9999-9999-999999999999'
  const apId = activeNodes.ap || '99999999-9999-9999-9999-999999999999'
  const isActiveInMap = activeApfloraLayers.includes(
    'beobZugeordnetAssignPolylines',
  )

  const beobFilter = {
    tpopId: { isNull: false },
    nichtZuordnen: { equalTo: false },
    x: { isNull: false },
    y: { isNull: false },
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
    addError(
      new Error(
        `Fehler beim Laden der Populationen für die Karte: ${error.message}`,
      ),
    )
  }

  const aparts = get(
    data,
    'projektById.apsByProjId.nodes[0].apartsByApId.nodes',
    [],
  )
  const beobs = useMemo(
    () =>
      flatten(
        aparts.map(a =>
          get(a, 'aeEigenschaftenByArtId.beobsByArtId.nodes', []),
        ),
      ),
    [aparts],
  )

  return beobs.map(beob => (
    <Polyline key={beob.id} beob={beob} treeName={treeName} />
  ))
}

export default observer(BeobZugeordnetAssignPolylines)
