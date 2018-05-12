import React from 'react'
import { inject } from 'mobx-react'
import compose from 'recompose/compose'
import 'leaflet'
import '../../../../../../node_modules/leaflet.markercluster/dist/leaflet.markercluster-src.js'
import { Query } from 'react-apollo'
import get from 'lodash/get'

import dataGql from './data.graphql'
import buildPopMarkers from './buildPopMarkers'
import PopMarkerCluster from './Cluster'

const enhance = compose(inject('store'))

const PmcComponent = ({ store, apId, projId }:{ store: Object, apId: String, projId: String}) => {
  const { tree } = store
  const { activeNodes, nodeLabelFilter } = tree
  const { ap, projekt } = activeNodes

  return (
    <Query query={dataGql}
      variables={{
        apId: ap,
        projId: projekt,
      }}
    >
      {({ loading, error, data }) => {
        if (error) return `Fehler: ${error.message}`

        const popFilterString = nodeLabelFilter.get('pop')
        const pops = get(data, 'projektById.apsByProjId.nodes[0].popsByApId.nodes', [])
          // filter them by nodeLabelFilter
          .filter(p => {
            if (!popFilterString) return true
            return `${p.nr || '(keine Nr)'}: ${p.name || '(kein Name)'}`.toLowerCase().includes(popFilterString.toLowerCase())
          })
        //const popBounds = getBounds(pops)
        const popMarkers = buildPopMarkers({ pops, store })

        return <PopMarkerCluster markers={popMarkers} />
      
    }}
  </Query>
  )
}


export default enhance(PmcComponent)
