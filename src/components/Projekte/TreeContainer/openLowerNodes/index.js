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
  jahr
}) => {
  /**
   * 1. load all data
   * 2. build openNodes for all data using setOpenNodesFromActiveNodeArray
   * 3. add these nodes to existing openNodes
   * 4. make sure every nodeArray is unique in openNodes
   * 5. activeNodeArray stays same
   * 6. refresh tree
   */
  console.log('openLowerNodes', {
    id,
    parentId,
    popId,
    apId,
    projId,
    menuType,
  })
  switch (menuType) {
    case 'popFolder':
      popFolder({ id, projId, client, store })
      break
    case 'pop':
      pop({ id, apId, projId, client, store })
      break
    case 'tpopFolder':
      tpopFolder({ id, apId, projId, client, store })
      break
    case 'tpop':
      tpop({ id, popId, apId, projId, client, store })
      break
    case 'tpopfeldkontrFolder':
      tpopfeldkontrFolder({
        id,
        apId,
        projId,
        popId,
        client,
        store,
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
      })
      break
    case 'zielFolder':
      zielFolder({ id, projId, client, store })
      break
    case 'zieljahrFolder':
      zieljahrFolder({
        id,
        projId,
        parentId,
        store,
        client,
        jahr
      })
      break
    default:
      // do nothing
      break
  }
}

export default openLowerNodes
