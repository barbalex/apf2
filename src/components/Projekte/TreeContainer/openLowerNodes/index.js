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
  treeName,
  id,
  parentId,
  menuType,
  refetchTree,
  client,
  mobxStore,
}: {
  treeName: string,
  id: String | Number,
  parentId: String | Number,
  menuType: String,
  refetchTree: () => void,
  client: Object,
  mobxStore: Object,
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
      popFolder({ treeName, id, refetchTree, client, mobxStore })
      break
    case 'pop':
      pop({ treeName, id, refetchTree, client, mobxStore })
      break
    case 'tpopFolder':
      tpopFolder({ treeName, id, refetchTree, client, mobxStore })
      break
    case 'tpop':
      tpop({ treeName, id, refetchTree, client, mobxStore })
      break
    case 'tpopfeldkontrFolder':
      tpopfeldkontrFolder({
        treeName,
        id,
        refetchTree,
        client,
        mobxStore,
      })
      break
    case 'tpopfreiwkontrFolder':
      tpopfreiwkontrFolder({
        treeName,
        id,
        refetchTree,
        client,
        mobxStore,
      })
      break
    case 'zielFolder':
      zielFolder({ treeName, id, refetchTree, client, mobxStore })
      break
    case 'zieljahrFolder':
      zieljahrFolder({
        treeName,
        id,
        parentId,
        refetchTree,
        mobxStore,
      })
      break
    default:
      // do nothing
      break
  }
}
