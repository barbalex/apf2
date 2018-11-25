// @flow
import { graphql } from 'react-apollo'
import { getSnapshot } from 'mobx-state-tree'

import query from './adresses'

export default graphql(query, {
  options: ({ mobxStore, treeName }) => {
    const { openNodes: openNodesRaw, activeNodeArray } = mobxStore[treeName]
    const openNodes = openNodesRaw.toJSON()
    console.log('withAdressen', { openNodes: getSnapshot(openNodesRaw) })

    return {
      isWerteListen: openNodes.some(
        nodeArray => nodeArray[0] === 'Werte-Listen',
      ),
      isAdresse: openNodes.some(
        nodeArray =>
          nodeArray[0] === 'Werte-Listen' &&
          activeNodeArray.length > 1 &&
          nodeArray[1] === 'Adressen',
      ),
    }
  },
  name: 'dataAdresses',
})
