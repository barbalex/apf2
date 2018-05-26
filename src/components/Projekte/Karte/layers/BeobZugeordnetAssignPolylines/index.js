import React from 'react'
import { inject } from 'mobx-react'
import compose from 'recompose/compose'
import { Query } from 'react-apollo'
import get from 'lodash/get'
import flatten from 'lodash/flatten'
import format from 'date-fns/format'

import dataGql from './data.graphql'
import buildLines from './buildLines'
import Polylines from './Polylines'

const enhance = compose(inject('store'))

const Lines = ({
  store,
  tree,
  activeNodes
} : {
  store: Object,
  tree: Object,
  activeNodes: Array<Object>
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

      return <Polylines lines={buildLines({ beobs, store, activeNodes })} />
    
  }}
</Query>


export default enhance(Lines)
