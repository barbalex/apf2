import tpopfreiwkontrFolder from './tpopfreiwkontrFolder'
import tpopfeldkontrFolder from './tpopfeldkontrFolder'
import tpop from './tpop'
import tpopFolder from './tpopFolder'
import pop from './pop'
import popFolder from './popFolder'
import zielFolder from './zielFolder'
import zieljahrFolder from './zieljahrFolder'

const openLowerNodes = ({
  id,
  parentId,
  popId,
  apId,
  projId,
  menuType,
  client,
  store,
  queryClient,
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
      popFolder({ id, projId, client, store, queryClient })
      break
    case 'pop':
      pop({ id, apId, projId, client, store, queryClient })
      break
    case 'tpopFolder':
      tpopFolder({ id, apId, projId, client, store, queryClient })
      break
    case 'tpop':
      tpop({ id, popId, apId, projId, client, store, queryClient })
      break
    case 'tpopfeldkontrFolder':
      tpopfeldkontrFolder({
        id,
        apId,
        projId,
        popId,
        client,
        store,
        queryClient,
      })
      break
    case 'tpopfreiwkontrFolder':
      tpopfreiwkontrFolder({
        id,
        apId,
        projId,
        popId,
        client,
        store,
        queryClient,
      })
      break
    case 'zielFolder':
      zielFolder({ id, projId, client, store, queryClient })
      break
    case 'zieljahrFolder':
      zieljahrFolder({
        id,
        projId,
        parentId,
        store,
        client,
        queryClient,
      })
      break
    default:
      // do nothing
      break
  }
}

export default openLowerNodes
