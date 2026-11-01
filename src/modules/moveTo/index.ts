/**
 * moves a dataset to a different parent
 * used when moving for instance tpop to other pop in tree
 */
import { tables } from '../tables.ts'
import { apiUpdate } from '../api.ts'
import {
  store,
  addNotificationAtom,
  movingAtom,
  setMovingAtom,
  type Notification,
  getTsQueryClientFromStore,
} from '../../store/index.ts'

const addNotification = (notification: Omit<Notification, 'key'>) =>
  store.set(addNotificationAtom, notification)

export const moveTo = async ({
  id: newParentId,
}: {
  id?: string | undefined
}) => {
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
  if (!dbTable) {
    return addNotification({
      message: 'change was not saved: Reason: table was not found',
      options: {
        variant: 'error',
      },
    })
  }
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

  // TODO: histories should also get the new parent id
  try {
    await apiUpdate(dbTable, id, { [parentIdField]: newParentId })
  } catch (error) {
    return addNotification({
      message: `Der Datensatz wurde nicht verschoben. Fehlermeldung: ${(error as Error).message}`,
      options: {
        variant: 'error',
      },
    })
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
