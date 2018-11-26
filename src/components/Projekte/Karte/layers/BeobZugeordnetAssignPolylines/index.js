import React, { useContext } from 'react'
import get from 'lodash/get'
import flatten from 'lodash/flatten'
import format from 'date-fns/format'

import buildLines from './buildLines'
import Polylines from './Polylines'
import mobxStoreContext from '../../../../../mobxStoreContext'

/**
 * not fetching data here because:
 * needs to be refetched after assigning beobs
 * so it is fetched in ProjektContainer
 */

const Lines = ({
  data,
  treeName,
  mapIdsFiltered,
}: {
  data: Object,
  treeName: string,
  mapIdsFiltered: Array<String>,
}) => {
  const mobxStore = useContext(mobxStoreContext)
  const tree = mobxStore[treeName]

  const beobZugeordnetFilterString = get(tree, 'nodeLabelFilter.beobZugeordnet')
  const aparts = get(
    data,
    'beobAssignLines.apsByProjId.nodes[0].apartsByApId.nodes',
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
  const lines = buildLines({
    beobs,
    treeName,
    mapIdsFiltered,
    mobxStore,
  })
  return <Polylines lines={lines} />
}

export default Lines
