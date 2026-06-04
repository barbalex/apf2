import { tpopfreiwkontrFolder } from './tpopfreiwkontrFolder/index.ts'
import { tpopfeldkontrFolder } from './tpopfeldkontrFolder/index.ts'
import { tpop } from './tpop/index.ts'
import { tpopFolder } from './tpopFolder/index.ts'
import { pop } from './pop/index.ts'
import { popFolder } from './popFolder/index.ts'
import { zielFolder } from './zielFolder/index.ts'
import { zieljahrFolder } from './zieljahrFolder/index.ts'

export const openLowerNodes = ({
  id,
  parentId,
  popId,
  apId,
  projId,
  menuType,
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
      popFolder({ id, projId })
      break
    case 'pop':
      pop({ id, apId, projId })
      break
    case 'tpopFolder':
      tpopFolder({ popId: id, apId, projId })
      break
    case 'tpop':
      tpop({ id, popId, apId, projId })
      break
    case 'tpopfeldkontrFolder':
      tpopfeldkontrFolder({
        id,
        apId,
        projId,
        popId,
      })
      break
    case 'tpopfreiwkontrFolder':
      tpopfreiwkontrFolder({
        id,
        apId,
        projId,
        popId,
      })
      break
    case 'zielFolder':
      zielFolder({ id, projId })
      break
    case 'zieljahrFolder':
      zieljahrFolder({
        id,
        projId,
        parentId,
        jahr,
      })
      break
    default:
      // do nothing
      break
  }
}
