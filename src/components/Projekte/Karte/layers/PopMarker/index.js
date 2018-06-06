import React from 'react'
import { Query } from 'react-apollo'
import get from 'lodash/get'

import dataGql from './data.graphql'
import buildMarkers from './buildMarkers'
import PopMarkerCluster from './Cluster'

const PmcComponent = ({
  tree,
  activeNodes,
  apfloraLayers,
  activeApfloraLayers,
  popLabelUsingNr,
  mapPopIdsFiltered,
}:{
  tree: Object,
  activeNodes: Array<Object>,
  apfloraLayers: Array<Object>,
  activeApfloraLayers: Array<String>,
  popLabelUsingNr: Boolean,
  mapPopIdsFiltered: Array<String>,
}) =>
  <Query query={dataGql}
    variables={{
      apId: activeNodes.ap,
      projId: activeNodes.projekt,
    }}
  >
    {({ loading, error, data }) => {
      if (error) return `Fehler: ${error.message}`

      const popFilterString = get(tree, 'nodeLabelFilter.pop')
      const pops = get(data, 'projektById.apsByProjId.nodes[0].popsByApId.nodes', [])
        // filter them by nodeLabelFilter
        .filter(p => {
          if (!popFilterString) return true
          return `${p.nr || '(keine Nr)'}: ${p.name || '(kein Name)'}`
            .toLowerCase()
            .includes(popFilterString.toLowerCase())
        })
      const popMarkers = buildMarkers({
        pops,
        activeNodes,
        apfloraLayers,
        activeApfloraLayers,
        data,
        popLabelUsingNr,
        mapPopIdsFiltered,
      })
      return <PopMarkerCluster markers={popMarkers} />
    
  }}
</Query>


export default PmcComponent
