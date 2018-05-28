//@flow
/**
   * 1. load all data
   * 2. build openNodes for all data using setOpenNodesFromActiveNodeArray
   * 3. add these nodes to existing openNodes
   * 4. make sure every nodeArray is unique in openNodes
   * 5. activeNodeArray stays same
   * 6. refresh tree
   */
import app from 'ampersand-app'
import get from 'lodash/get'
import flatten from 'lodash/flatten'

import dataGql from './data.graphql'

export default ({
  tree,
  activeNodes,
  id,
}:{
  tree: Object,
  activeNodes: Object,
  id: String,
}) => {
  const { client } = app
  const { openNodes } = tree
  const { data } = client.query({
    query: dataGql,
    variables: { id }
  })
  const newOpenNodes = [...openNodes]
  const tpopkontrs = get(data, 'tpopById.tpopkontrsByTpopId.nodes')
  tpopkontrs.forEach(k => {
    
  })
}