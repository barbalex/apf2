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
  addNotificationAtom,
  movingAtom,
  setMovingAtom,
  type Notification,
  getApolloClientFromStore,
  getTsQueryClientFromStore,
} from '../../store/index.ts'

const addNotification = (notification: Omit<Notification, 'key'>) =>
  store.set(addNotificationAtom, notification)

export const moveTo = async ({
  id: newParentId,
}: {
  id?: string | undefined
}) => {
  const apolloClient = getApolloClientFromStore()
  const tsQueryClient = getTsQueryClientFromStore()

  const moving = store.get(movingAtom)
  const table = moving?.table
  const id = moving?.id

  if (!newParentId) {
    return addNotification({
      message: 'change was not saved: Reason: parent is missing',
      options: {
        variant: 'error',
      },
    })
  }
  if (!id) {
    return addNotification({
      message:
        'change was not saved: Reason: the dataset to move was not found',
      options: {
        variant: 'error',
      },
    })
  }

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
  // console.log('moveTo', { table, id, newParentId })
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
      // TODO: histories should also get the new popId
      await apolloClient.mutate({
        mutation: updateTpopById,
        variables: { id, popId: newParentId },
      })
      break
    case 'pop':
      // TODO: histories should also get the new apId
      await apolloClient.mutate({
        mutation: updatePopById,
        variables: { id, apId: newParentId },
      })
      break
    case null:
    default:
      // do nothing
      break
  }
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
    void tsQueryClient.invalidateQueries({
      queryKey: [`treePop`],
    })
    void tsQueryClient.invalidateQueries({
      queryKey: [`treeApFolders`],
    })
    void tsQueryClient.invalidateQueries({
      queryKey: ['treeAp'],
    })
  }
  if (table === 'tpop') {
    void tsQueryClient.invalidateQueries({
      queryKey: [`treeTpop`],
    })
    void tsQueryClient.invalidateQueries({
      queryKey: ['treePopFolders'],
    })
    void tsQueryClient.invalidateQueries({
      queryKey: ['treePop'],
    })
  }
  if (table === 'tpopmassn') {
    void tsQueryClient.invalidateQueries({
      queryKey: [`treeTpopmassn`],
    })
    void tsQueryClient.invalidateQueries({
      queryKey: [`treeTpop`],
    })
  }
  if (table === 'tpopfeldkontr') {
    void tsQueryClient.invalidateQueries({
      queryKey: [`treeTpopfeldkontr`],
    })
    void tsQueryClient.invalidateQueries({
      queryKey: [`treeTpop`],
    })
    void tsQueryClient.invalidateQueries({
      queryKey: [`treeTpopFolders`],
    })
  }
  if (table === 'tpopfreiwkontr') {
    void tsQueryClient.invalidateQueries({
      queryKey: [`treeTpopfreiwkontr`],
    })
    void tsQueryClient.invalidateQueries({
      queryKey: [`treeTpop`],
    })
  }
  return
}
