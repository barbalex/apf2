import { tpopfreiwkontrFolder } from './tpopfreiwkontrFolder/index.js'
import { tpopfeldkontrFolder } from './tpopfeldkontrFolder/index.js'
import { tpop } from './tpop/index.js'
import { tpopFolder } from './tpopFolder/index.js'
import { pop } from './pop/index.js'
import { popFolder } from './popFolder/index.js'
import { zielFolder } from './zielFolder/index.js'
import { zieljahrFolder } from './zieljahrFolder/index.js'

export const openLowerNodes = ({
  id,
  parentId,
  popId,
  apId,
  projId,
  menuType,
  client: apolloClient,
  store,
  jahr,
}) => {
  /**
   * 1. load all data
   * 2. build openNodes for all data using setOpenNodesFromActiveNodeArray
   * 3. add these nodes to existing openNodes
   * 4. make sure every nodeArray is unique in openNodes
   * 5. activeNodeArray stays same
   * 6. refresh tree
   */
  // console.log('openLowerNodes', {
  //   id,
  //   parentId,
  //   popId,
  //   apId,
  //   projId,
  //   menuType,
  //   jahr,
  // })
  switch (menuType) {
    case 'popFolder':
      popFolder({ id, projId, apolloClient, store })
      break
    case 'pop':
      pop({ id, apId, projId, apolloClient, store })
      break
    case 'tpopFolder':
      tpopFolder({ id, apId, projId, apolloClient, store })
      break
    case 'tpop':
      tpop({ id, popId, apId, projId, apolloClient, store })
      break
    case 'tpopfeldkontrFolder':
      tpopfeldkontrFolder({
        id,
        apId,
        projId,
        popId,
        apolloClient,
        store,
      })
      break
    case 'tpopfreiwkontrFolder':
      tpopfreiwkontrFolder({
        id,
        apId,
        projId,
        popId,
        apolloClient,
        store,
      })
      break
    case 'zielFolder':
      zielFolder({ id, projId, client: apolloClient, store })
      break
    case 'zieljahrFolder':
      zieljahrFolder({
        id,
        projId,
        parentId,
        store,
        client: apolloClient,
        jahr,
      })
      break
    default:
      // do nothing
      break
  }
}
