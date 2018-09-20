// @flow
import tpopfreiwkontrFolder from './tpopfreiwkontrFolder'
import tpopfeldkontrFolder from './tpopfeldkontrFolder'
import tpop from './tpop'
import tpopFolder from './tpopFolder'
import pop from './pop'
import popFolder from './popFolder'
import zielFolder from './zielFolder'
import zieljahrFolder from './zieljahrFolder'

export default ({
  tree,
  activeNodes,
  id,
  parentId,
  menuType,
  refetchTree,
}: {
  tree: Object,
  activeNodes: Object,
  id: String | Number,
  parentId: String | Number,
  menuType: String,
  refetchTree: () => void,
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
      popFolder({ tree, id, activeNodes, refetchTree })
      break
    case 'pop':
      pop({ tree, id, activeNodes, refetchTree })
      break
    case 'tpopFolder':
      tpopFolder({ tree, id, activeNodes, refetchTree })
      break
    case 'tpop':
      tpop({ tree, id, activeNodes, refetchTree })
      break
    case 'tpopfeldkontrFolder':
      tpopfeldkontrFolder({ tree, id, activeNodes, refetchTree })
      break
    case 'tpopfreiwkontrFolder':
      tpopfreiwkontrFolder({ tree, id, activeNodes, refetchTree })
      break
    case 'zielFolder':
      zielFolder({ tree, id, activeNodes, refetchTree })
      break
    case 'zieljahrFolder':
      zieljahrFolder({ tree, id, parentId, activeNodes, refetchTree })
      break
    default:
      // do nothing
      break
  }
}
