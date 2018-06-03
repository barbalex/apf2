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
  apfloraLayers,
  clustered,
} : {
  store: Object,
  tree: Object,
  activeNodes: Array<Object>,
  apfloraLayers: Array<Object>,
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

      if (clustered) {
        const markers = buildMarkersClustered({
          tpops,
          store,
          activeNodes,
          apfloraLayers,
          data,
        })
        return <MarkerCluster markers={markers} />
      }
      const markers = buildMarkers({
        tpops,
        store,
        activeNodes,
        apfloraLayers,
        data,
      })
      return <Marker markers={markers} />
    
  }}
</Query>


export default enhance(TpopMarkerMarker)
