import { tpopfreiwkontrFolder } from './tpopfreiwkontrFolder/index.ts'
import type { Store } from 'jotai'
import { tpopfeldkontrFolder } from './tpopfeldkontrFolder/index.ts'
import { tpop } from './tpop/index.ts'
import { tpopFolder } from './tpopFolder/index.ts'
import { pop } from './pop/index.ts'
import { popFolder } from './popFolder/index.ts'
import { zielFolder } from './zielFolder/index.ts'
import { zieljahrFolder } from './zieljahrFolder/index.ts'

interface OpenLowerNodesParams {
  store: Store
  id?: string | null | undefined
  parentId?: string | null | undefined
  popId?: string | null | undefined
  apId?: string | null | undefined
  projId?: string | null | undefined
  menuType?: string | null | undefined
  jahr?: string | null | undefined
}

export const openLowerNodes = ({
  store,
  id,
  parentId,
  popId,
  apId,
  projId,
  menuType,
  jahr,
}: OpenLowerNodesParams) => {
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
      void popFolder({ store, id, projId })
      break
    case 'pop':
      void pop({ store, id, apId, projId })
      break
    case 'tpopFolder':
      void tpopFolder({ store, popId: id, apId, projId })
      break
    case 'tpop':
      void tpop({ store, id, popId, apId, projId })
      break
    case 'tpopfeldkontrFolder':
      void tpopfeldkontrFolder({
        store,
        id,
        apId,
        projId,
        popId,
      })
      break
    case 'tpopfreiwkontrFolder':
      void tpopfreiwkontrFolder({
        store,
        id,
        apId,
        projId,
        popId,
      })
      break
    case 'zielFolder':
      void zielFolder({ store, id, projId })
      break
    case 'zieljahrFolder':
      void zieljahrFolder({
        store,
        id,
        projId,
        parentId,
        jahr,
      })
      break
    case undefined:
    case null:
    default:
      // do nothing
      break
  }
}
