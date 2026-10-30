/**
 * copies a dataset to a different parent
 * used when copying for instance tpop to other pop in tree
 */
import { v7 as uuidv7 } from 'uuid'

import { tables } from '../tables.ts'
import { apiFetch, apiInsert } from '../api.ts'
import { copyTpopsOfPop } from '../copyTpopsOfPop.ts'
import { copyZaehlOfTpopKontr } from '../copyZaehlOfTpopKontr.ts'

import {
  store,
  addNotificationAtom,
  copyingAtom,
  type Notification,
  getTsQueryClientFromStore,
} from '../../store/index.ts'

const addNotification = (notification: Omit<Notification, 'key'>) =>
  store.set(addNotificationAtom, notification)

// columns that must not be copied: system columns get fresh defaults,
// old_id belongs to the original row (uuidv7 migration bookkeeping)
const stripColumns = [
  'created_at',
  'updated_at',
  'changed_by',
  'old_id',
] as const

// copyTpopsOfPop can pass table and id separately
export const copyTo = async ({
  parentId,
  table: tablePassed,
  id: idPassed,
}: {
  parentId?: string | undefined
  table?: string | undefined
  id?: string | undefined
}) => {
  const tsQueryClient = getTsQueryClientFromStore()

  const copying = store.get(copyingAtom)
  const table = tablePassed ?? copying.table
  const id = idPassed ?? copying.id
  const withNextLevel = copying.withNextLevel ?? false

  // ensure derived data exists
  const tabelle = tables.find((t) => t.table === table)
  if (!tabelle) {
    return addNotification({
      message: `change was not saved because table "${table}" was not found`,
      options: {
        variant: 'error',
      },
    })
  }
  // in tpopfeldkontr and tpopfreiwkontr need to find dbTable
  const dbTable = tabelle.dbTable ?? tabelle.table
  if (!tabelle.parentIdField) {
    return addNotification({
      message: `change was not saved because parent field of table "${table}" was not found`,
      options: {
        variant: 'error',
      },
    })
  }

  // get data: all columns; geometry comes as GeoJSON and round-trips
  const row = (
    await apiFetch<Record<string, unknown>[]>(
      `/${dbTable}?id=eq.${id}&select=*`,
    )
  )?.[0]

  if (!row) {
    return addNotification({
      message: 'change was not saved because dataset was not found in store',
      options: {
        variant: 'error',
      },
    })
  }

  // insert the copy with a new id and the new parent
  const newId = uuidv7()
  const copy: Record<string, unknown> = {
    ...row,
    id: newId,
    [tabelle.parentIdField]: parentId,
  }
  stripColumns.forEach((column) => delete copy[column])
  try {
    await apiInsert(dbTable, copy)
  } catch (error) {
    return addNotification({
      message: `Die Kopie wurde nicht erstellt. Fehlermeldung: ${(error as Error).message}`,
      options: {
        variant: 'error',
      },
    })
  }

  // update tree data
  if (table === 'pop') {
    void tsQueryClient.invalidateQueries({
      queryKey: ['treePop'],
    })
    void tsQueryClient.invalidateQueries({
      queryKey: ['treeApFolders'],
    })
    void tsQueryClient.invalidateQueries({
      queryKey: ['treeAp'],
    })
  }
  if (table === 'tpop') {
    void tsQueryClient.invalidateQueries({
      queryKey: ['treeTpop'],
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
      queryKey: ['treeTpopmassn'],
    })
    void tsQueryClient.invalidateQueries({
      queryKey: ['treeTpop'],
    })
  }
  if (table === 'tpopfeldkontr') {
    // always copy Zaehlungen
    void copyZaehlOfTpopKontr({
      tpopkontrIdFrom: id as string,
      tpopkontrIdTo: newId,
    })
    void tsQueryClient.invalidateQueries({
      queryKey: ['treeTpopfeldkontr'],
    })
    void tsQueryClient.invalidateQueries({
      queryKey: ['treeTpop'],
    })
  }
  if (table === 'tpopfreiwkontr') {
    void tsQueryClient.invalidateQueries({
      queryKey: ['treeTpopfreiwkontr'],
    })
    void tsQueryClient.invalidateQueries({
      queryKey: ['treeTpop'],
    })
  }

  // copy tpop if needed
  if (table === 'pop' && withNextLevel) {
    void copyTpopsOfPop({
      popIdFrom: id as string,
      popIdTo: newId,
    })
  }
}
