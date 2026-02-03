/**
 * moves a dataset to a different parent
 * used when moving for instance tpop to other pop in tree
 */
import { tables } from '../tables.ts'
import { updateTpopkontrById } from './updateTpopkontrById.ts'
import { updateTpopmassnById } from './updateTpopmassnById.ts'
import { updateTpopById } from './updateTpopById.ts'
import { updatePopById } from './updatePopById.ts'
import {
  store,
  apolloClientAtom,
  tsQueryClientAtom,
  addNotificationAtom,
  movingAtom,
  setMovingAtom,
} from '../../store/index.ts'

const addNotification = (notification) =>
  store.set(addNotificationAtom, notification)

export const moveTo = async ({ id: newParentId }) => {
  const apolloClient = store.get(apolloClientAtom)
  const tsQueryClient = store.get(tsQueryClientAtom)

  const moving = store.get(movingAtom)
  const table = moving?.table
  const id = moving?.id

  // ensure derived data exists
  const tabelle = tables.find((t) => t.table === table)
  // in tpopfeldkontr and tpopfreiwkontr need to find dbTable
  const dbTable = tabelle?.dbTable ?? table
  const idField = tabelle?.idField
  if (!idField) {
    return addNotification({
      message: 'change was not saved: Reason: idField was not found',
      options: {
        variant: 'error',
      },
    })
  }
  const parentIdField = tabelle.parentIdField
  if (!parentIdField) {
    return addNotification({
      message: 'change was not saved: Reason: parentIdField was not found',
      options: {
        variant: 'error',
      },
    })
  }

  // move
  switch (dbTable) {
    case 'tpopkontr':
      await apolloClient.mutate({
        mutation: updateTpopkontrById,
        variables: { id, tpopId: newParentId },
      })
      break
    case 'tpopmassn':
      await apolloClient.mutate({
        mutation: updateTpopmassnById,
        variables: { id, tpopId: newParentId },
      })
      break
    case 'tpop':
      await apolloClient.mutate({
        mutation: updateTpopById,
        variables: { id, popId: newParentId },
      })
      break
    case 'pop':
      await apolloClient.mutate({
        mutation: updatePopById,
        variables: { id, apId: newParentId },
      })
      break
    default:
      // do nothing
      break
  }
  console.log('moveTo', { table, id, newParentId })
  // reset moving
  store.set(setMovingAtom, {
    table: null,
    id: '99999999-9999-9999-9999-999999999999',
    label: null,
    toTable: null,
    fromParentId: null,
  })

  // update tree ap queries, tree pop folder queries, tree pop queries
  if (table === 'pop') {
    tsQueryClient.invalidateQueries({
      queryKey: [`treePop`],
    })
    tsQueryClient.invalidateQueries({
      queryKey: [`treeApFolders`],
    })
    tsQueryClient.invalidateQueries({
      queryKey: ['treeAp'],
    })
  }
  if (table === 'tpop') {
    tsQueryClient.invalidateQueries({
      queryKey: [`treeTpop`],
    })
    tsQueryClient.invalidateQueries({
      queryKey: ['treePopFolders'],
    })
    tsQueryClient.invalidateQueries({
      queryKey: ['treePop'],
    })
  }
  if (table === 'tpopmassn') {
    tsQueryClient.invalidateQueries({
      queryKey: [`treeTpopmassn`],
    })
    tsQueryClient.invalidateQueries({
      queryKey: [`treeTpop`],
    })
  }
  if (table === 'tpopfeldkontr') {
    tsQueryClient.invalidateQueries({
      queryKey: [`treeTpopfeldkontr`],
    })
    tsQueryClient.invalidateQueries({
      queryKey: [`treeTpop`],
    })
    tsQueryClient.invalidateQueries({
      queryKey: [`treeTpopFolders`],
    })
  }
  if (table === 'tpopfreiwkontr') {
    tsQueryClient.invalidateQueries({
      queryKey: [`treeTpopfreiwkontr`],
    })
    tsQueryClient.invalidateQueries({
      queryKey: [`treeTpop`],
    })
  }
  return
}
