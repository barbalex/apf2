// @flow
import tpopfreiwkontrFolder from './tpopfreiwkontrFolder'
import tpopfeldkontrFolder from './tpopfeldkontrFolder'
import tpop from './tpop'
import tpopFolder from './tpopFolder'

export default ({
  tree,
  activeNodes,
  id,
  menuType,
  refetch,
}: {
  tree: Object,
  activeNodes: Object,
  id: String,
  menuType: String,
  refetch: () => void,
}) => {
   /**
   * 1. load all data
   * 2. build openNodes for all data using setOpenNodesFromActiveNodeArray
   * 3. add these nodes to existing openNodes
   * 4. make sure every nodeArray is unique in openNodes
   * 5. activeNodeArray stays same
   * 6. refresh tree
   */
  switch (menuType) {
    case 'popFolder':
      // TODO
      break;
    case 'pop':
      // TODO
      break;
    case 'tpopFolder':
      tpopFolder({ tree, id, activeNodes, refetch })
      break;
    case 'tpop':
    tpop({ tree, id, activeNodes, refetch })
      break;
    case 'tpopfeldkontrFolder':
      tpopfeldkontrFolder({ tree, id, activeNodes, refetch })
      break;
    case 'tpopfreiwkontrFolder':
      tpopfreiwkontrFolder({ tree, id, activeNodes, refetch })
      break;
    default:
      // do nothing
      break;
  }
}