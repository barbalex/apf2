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
  client,
  store,
}: {
  treeName: string,
  id: String | Number,
  parentId: String | Number,
  menuType: String,
  client: Object,
  store: Object,
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
      popFolder({ treeName, id, client, store })
      break
    case 'pop':
      pop({ treeName, id, client, store })
      break
    case 'tpopFolder':
      tpopFolder({ treeName, id, client, store })
      break
    case 'tpop':
      tpop({ treeName, id, client, store })
      break
    case 'tpopfeldkontrFolder':
      tpopfeldkontrFolder({
        treeName,
        id,
        client,
        store,
      })
      break
    case 'tpopfreiwkontrFolder':
      tpopfreiwkontrFolder({
        treeName,
        id,
        client,
        store,
      })
      break
    case 'zielFolder':
      zielFolder({ treeName, id, client, store })
      break
    case 'zieljahrFolder':
      zieljahrFolder({
        treeName,
        id,
        parentId,
        store,
        client,
      })
      break
    default:
      // do nothing
      break
  }
}
