// @flow
import { graphql } from 'react-apollo'

import query from './data'

export default graphql(query, {
  options: ({ apfloraLayer, treeName, mobxStore }) => {
    const activeNodes = mobxStore[`${treeName}ActiveNodes`]
    const { activeApfloraLayers } = mobxStore
    const layer = apfloraLayer.value
    const pop = layer === 'pop' && activeApfloraLayers.includes('pop')
    const tpop = layer === 'tpop' && activeApfloraLayers.includes('tpop')
    const beobNichtBeurteilt =
      layer === 'beobNichtBeurteilt' &&
      activeApfloraLayers.includes('beobNichtBeurteilt')
    const beobNichtZuzuordnen =
      layer === 'beobNichtZuzuordnen' &&
      activeApfloraLayers.includes('beobNichtZuzuordnen')
    const beobZugeordnet =
      layer === 'beobZugeordnet' &&
      activeApfloraLayers.includes('beobZugeordnet')
    const beobZugeordnetAssignPolylines =
      layer === 'beobZugeordnetAssignPolylines' &&
      activeApfloraLayers.includes('beobZugeordnetAssignPolylines')

    return {
      variables: {
        ap: activeNodes.ap ? [activeNodes.ap] : [],
        pop,
        tpop,
        beobNichtBeurteilt,
        beobNichtZuzuordnen,
        beobZugeordnet,
        beobZugeordnetAssignPolylines,
      },
    }
  },
  name: 'data',
})
