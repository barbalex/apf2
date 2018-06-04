import React from 'react'
import { inject } from 'mobx-react'
import compose from 'recompose/compose'
import { Query } from 'react-apollo'
import get from 'lodash/get'

import dataGql from './data.graphql'
import buildMarkers from './buildMarkers'
import PopMarkerCluster from './Cluster'

const enhance = compose(inject('store'))

const PmcComponent = ({
  store,
  tree,
  activeNodes,
  apfloraLayers,
  activeApfloraLayers,
  popLabelUsingNr,
}:{
  store: Object,
  tree: Object,
  activeNodes: Array<Object>,
  apfloraLayers: Array<Object>,
  activeApfloraLayers: Array<String>,
  popLabelUsingNr: Boolean,
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
        store,
        activeNodes,
        apfloraLayers,
        activeApfloraLayers,
        data,
        popLabelUsingNr,
      })
      return <PopMarkerCluster markers={popMarkers} />
    
  }}
</Query>


export default enhance(PmcComponent)
