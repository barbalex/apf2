import React from 'react'
import { inject } from 'mobx-react'
import compose from 'recompose/compose'
import { Query } from 'react-apollo'
import get from 'lodash/get'
import flatten from 'lodash/flatten'

import dataGql from './data.graphql'
import buildMarkers from './buildMarkers'
import buildMarkersClustered from './buildMarkersClustered'
import Marker from './Marker'
import MarkerCluster from './MarkerCluster'

const enhance = compose(inject('store'))

const TpopMarkerMarker = ({
  store,
  tree,
  activeNodes,
  clustered,
} : {
  store: Object,
  tree: Object,
  activeNodes: Array<Object>,
  clustered: Boolean,
}) =>
  <Query query={dataGql}
    variables={{
      apId: activeNodes.ap,
      projId: activeNodes.projekt,
    }}
  >
    {({ loading, error, data }) => {
      if (error) return `Fehler: ${error.message}`

      const tpopFilterString = get(tree, 'nodeLabelFilter.tpop')
      const pops = get(data, 'projektById.apsByProjId.nodes[0].popsByApId.nodes', [])
      const tpops = flatten(pops.map(pop => get(pop, 'tpopsByPopId.nodes', [])))
        // filter them by nodeLabelFilter
        .filter(el => {
          if (!tpopFilterString) return true
          return `${el.nr || '(keine Nr)'}: ${el.flurname || '(kein Flurname)'}`
            .toLowerCase()
            .includes(tpopFilterString.toLowerCase())
        })

      if (clustered) return <MarkerCluster markers={buildMarkersClustered({ tpops, store, activeNodes })} />
      return <Marker markers={buildMarkers({ tpops, store, activeNodes })} />
    
  }}
</Query>


export default enhance(TpopMarkerMarker)
