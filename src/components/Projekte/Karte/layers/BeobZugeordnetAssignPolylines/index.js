import React from 'react'
import { Query } from 'react-apollo'
import get from 'lodash/get'
import flatten from 'lodash/flatten'
import format from 'date-fns/format'

import dataGql from './data.graphql'
import buildLines from './buildLines'
import Polylines from './Polylines'

const Lines = ({
  tree,
  activeNodes,
  mapBeobZugeordnetIdsFiltered,
} : {
  tree: Object,
  activeNodes: Array<Object>,
  mapBeobZugeordnetIdsFiltered: Array<String>,
}) =>
  <Query query={dataGql}
    variables={{
      apId: activeNodes.ap,
      projId: activeNodes.projekt
    }}
  >
    {({ loading, error, data }) => {
      if (error) return `Fehler: ${error.message}`

      const beobZugeordnetFilterString = get(tree, 'nodeLabelFilter.beobZugeordnet')
      const aparts = get(data, 'projektById.apsByProjId.nodes[0].apartsByApId.nodes', [])
      const beobs = flatten(aparts.map(a => get(a, 'aeEigenschaftenByArtId.beobsByArtId.nodes', [])))
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
        activeNodes,
        mapBeobZugeordnetIdsFiltered,
      })
      return <Polylines lines={lines} />
    
  }}
</Query>


export default Lines
