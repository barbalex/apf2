import {
  store,
  addNotificationAtom,
  removeDeletedDatasetByIdAtom,
  deletedDatasetsAtom,
  tsQueryClientAtom,
  navigateAtom,
  setShowDeletionsAtom,
  type Notification,
} from '../../../store/index.ts'
import { tables } from '../../../modules/tables.ts'
import { apiInsert } from '../../../modules/api.ts'
import { invalidateTreeQueries } from '../../../modules/invalidateTreeQueries.ts'

const addNotification = (notification: Omit<Notification, 'key'>) =>
  store.set(addNotificationAtom, notification)

export const undelete = async ({ id }: { id: string }) => {
  const deletedDatasets = store.get(deletedDatasetsAtom)

  const dataset = deletedDatasets.find((d) => d.id === id)
  if (!dataset) {
    return addNotification({
      message: `Der zu wiederherstellende Datensatz mit der ID ${id} wurde nicht gefunden.`,
      options: {
        variant: 'error',
      },
    })
  }

  const { table, data } = dataset
  if (!data || typeof data !== 'object') {
    return addNotification({
      message: `Für den Datensatz mit der ID ${id} fehlen die Daten, um ihn wiederherzustellen.`,
      options: {
        variant: 'error',
      },
    })
  }

  // create the dataset again, with the same id as before (tree urls
  // reference it). data is the snake_case row snapshot (select=*) that
  // deletion took, so it round-trips as the insert body
  try {
    await apiInsert(table, data)
  } catch (error) {
    return addNotification({
      message: (error as Error).message,
      options: {
        variant: 'error',
      },
    })
  }

  // 2. remove dataset from deletedDatasets
  if (deletedDatasets.length === 1) store.set(setShowDeletionsAtom, false)
  store.set(removeDeletedDatasetByIdAtom, dataset.id)

  // 3. update the nav tree
  const tsQueryClient = store.get(tsQueryClientAtom)
  if (tsQueryClient) {
    const parentTable = tables.find((t) => t.table === table)?.parentTable
    invalidateTreeQueries({ tsQueryClient, table, parentTable })
  }

  // 4. navigate to the restored dataset
  // tree urls do not include the leading 'Daten' segment,
  // form-menu urls do
  const navigate = store.get(navigateAtom)
  if (dataset.url) {
    const url = [...dataset.url]
    if (url[0] === 'Daten') url.shift()
    navigate?.(`/Daten/${url.join('/')}${window.location.search}`)
  }
}
