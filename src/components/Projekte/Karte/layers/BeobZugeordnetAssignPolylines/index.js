import React, { useContext } from 'react'
import get from 'lodash/get'
import flatten from 'lodash/flatten'
import format from 'date-fns/format'
import { useQuery } from 'react-apollo-hooks'
import { observer } from 'mobx-react-lite'

import Polyline from './Polyline'
import mobxStoreContext from '../../../../../mobxStoreContext'
import query from './data'

/**
 * not fetching data here because:
 * needs to be refetched after assigning beobs
 * so it is fetched in ProjektContainer
 */

const Lines = ({ treeName }: { treeName: string }) => {
  const mobxStore = useContext(mobxStoreContext)
  const { setRefetchKey, addError, activeApfloraLayers } = mobxStore
  const tree = mobxStore[treeName]

  const activeNodes = mobxStore[`${treeName}ActiveNodes`]
  const projId = activeNodes.projekt || '99999999-9999-9999-9999-999999999999'
  const apId = activeNodes.ap || '99999999-9999-9999-9999-999999999999'
  var { data, error, refetch } = useQuery(query, {
    suspend: false,
    variables: { projId, apId },
  })
  setRefetchKey({ key: 'beobAssignLines', value: refetch })

  if (error) {
    addError(
      new Error(
        `Fehler beim Laden der Populationen für die Karte: ${error.message}`,
      ),
    )
  }

  const beobZugeordnetFilterString = get(tree, 'nodeLabelFilter.beobZugeordnet')
  const aparts = get(
    data,
    'projektById.apsByProjId.nodes[0].apartsByApId.nodes',
    [],
  )
  const beobs = flatten(
    aparts.map(a => get(a, 'aeEigenschaftenByArtId.beobsByArtId.nodes', [])),
  )
    // filter them by nodeLabelFilter
    .filter(el => {
      if (!beobZugeordnetFilterString) return true
      const datum = el.datum ? format(el.datum, 'YYYY.MM.DD') : '(kein Datum)'
      const autor = el.autor || '(kein Autor)'
      const quelle = get(el, 'beobQuelleWerteByQuelleId.name', '')
      return `${datum}: ${autor} (${quelle})`
        .toLowerCase()
        .includes(beobZugeordnetFilterString.toLowerCase())
    })
  console.log('BeobZugeordnetAssignPolylines', {
    activeApfloraLayers: activeApfloraLayers.toJSON(),
    beobs,
  })
  const beobsToUse = activeApfloraLayers.includes(
    'beobZugeordnetAssignPolylines',
  )
    ? beobs
    : []
  console.log('BeobZugeordnetAssignPolylines', {
    beobsToUse,
  })
  return beobsToUse.map(beob => (
    <Polyline key={beob.id} beob={beob} treeName={treeName} />
  ))
}

export default observer(Lines)
