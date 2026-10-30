import { isEqual } from 'es-toolkit'

import { tables } from '../../../../../modules/tables.ts'
import { apiFetch, apiDelete } from '../../../../../modules/api.ts'
import { invalidateTreeQueries } from '../../../../../modules/invalidateTreeQueries.ts'
import {
  store,
  tsQueryClientAtom,
  addNotificationAtom,
  navigateAtom,
  emptyToDeleteAtom,
  addDeletedDatasetAtom,
  treeOpenNodesAtom,
  treeSetOpenNodesAtom,
  treeActiveNodeArrayAtom,
  type Notification,
  type DeletedDataset,
  type ToDelete,
} from '../../../../../store/index.ts'

const addNotification = (notification: Omit<Notification, 'key'>) =>
  store.set(addNotificationAtom, notification)

const isFreiwilligenKontrolle = (activeNodeArray: (string | number)[]) =>
  activeNodeArray[activeNodeArray.length - 2] === 'Freiwilligen-Kontrollen'

export const deleteModule = async ({
  search,
  toDelete: toDeletePassed,
}: {
  search: string
  toDelete: ToDelete
}) => {
  const tsQueryClient = store.get(tsQueryClientAtom)
  if (!tsQueryClient) {
    return addNotification({
      message: 'no query client found in store',
      options: {
        variant: 'error',
      },
    })
  }
  const navigate = store.get(navigateAtom)
  const toDelete = toDeletePassed
  // deletion is only possible with a dataset selected
  if (!toDelete.id) {
    return addNotification({
      message: 'Es wurde kein Datensatz gewählt.',
      options: {
        variant: 'error',
      },
    })
  }

  // some tables need to be translated, i.e. tpopfreiwkontr
  const tableMetadata = tables.find((t) => t.table === toDelete.table)
  const parentTable = tableMetadata?.parentTable
  if (!tableMetadata) {
    return addNotification({
      message: `Error in action deleteDatasetDemand: no table meta data found for table "${toDelete.table}"`,
      options: {
        variant: 'error',
      },
    })
  }
  // tableMetadata.table === toDelete.table is guaranteed by the find above
  const table =
    tableMetadata.dbTable ? tableMetadata.dbTable : tableMetadata.table

  /**
   * fetch data for dataset (all columns, as later needed for undelete)
   * then add it to deletedDatasets
   */
  let data: Record<string, unknown> | undefined
  try {
    data = (
      await apiFetch<Record<string, unknown>[]>(
        `/${table}?id=eq.${toDelete.id}&select=*`,
      )
    )?.[0]
  } catch (error) {
    console.log(error)
    return addNotification({
      message: (error as Error).message,
      options: {
        variant: 'error',
      },
    })
  }

  // add to datasetsDeleted
  // cast: toDelete fields are nullable in the atom
  // but deletion is only possible with a dataset selected
  store.set(addDeletedDatasetAtom, {
    table,
    id: toDelete.id,
    label: toDelete.label,
    url: toDelete.url,
    data,
    time: Date.now(),
    afterDeletionHook: toDelete.afterDeletionHook,
  } as unknown as DeletedDataset)

  try {
    await apiDelete(table, toDelete.id)
  } catch (error) {
    return addNotification({
      message: (error as Error).message,
      options: {
        variant: 'error',
      },
    })
  }

  // if tpop was deleted: set beob free
  // not necessary: is done by reference by db
  // BUT: need to refetch tree

  // set new url if necessary
  const activeNodeArray1 = store.get(treeActiveNodeArrayAtom)
  if (
    toDelete.url &&
    isEqual(activeNodeArray1, toDelete.url) &&
    !isFreiwilligenKontrolle(activeNodeArray1)
  ) {
    const newActiveNodeArray1 = [...toDelete.url]
    newActiveNodeArray1.pop()
    // if zieljahr is active, need to pop again,
    // (in case there is no other ziel left in same year)
    if (table === 'ziel') {
      newActiveNodeArray1.pop()
    }
    setTimeout(
      () => navigate?.(`/Daten/${newActiveNodeArray1.join('/')}${search}`),
      300,
    )
  }

  // remove from openNodes
  const openNodes = store.get(treeOpenNodesAtom)
  const newOpenNodes = openNodes.filter((n) => !isEqual(n, toDelete.url))
  store.set(treeSetOpenNodesAtom, newOpenNodes)
  // invalidate tree queries for count and data
  invalidateTreeQueries({ tsQueryClient, table, parentTable })

  if (toDelete.afterDeletionHook) toDelete.afterDeletionHook()

  // reset datasetToDelete
  store.set(emptyToDeleteAtom)
}
