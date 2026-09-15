import { upperFirst } from 'es-toolkit'
import { camelCase } from 'es-toolkit'

import {
  store,
  addNotificationAtom,
  removeDeletedDatasetByIdAtom,
  deletedDatasetsAtom,
  apolloClientAtom,
  setShowDeletionsAtom,
  type Notification,
} from '../../../store/index.ts'

const addNotification = (notification: Omit<Notification, 'key'>) =>
  store.set(addNotificationAtom, notification)

export const undelete = async ({ id }: { id: string }) => {
  const apolloClient = store.get(apolloClientAtom)
  if (!apolloClient) {
    return addNotification({
      message: 'Der Apollo Client ist noch nicht initialisiert.',
      options: { variant: 'error' },
    })
  }
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

  const { table, data, afterDeletionHook } = dataset
  const isWerte = table.toLowerCase().includes('werte')
  // 1. create new dataset
  // use one query for all werte tables
  const queryName =
    isWerte ? 'createWerte' : `create${upperFirst(camelCase(table))}`
  let mutation: unknown
  console.log('undelete queryName:', queryName)
  try {
    mutation = await import(`./queries/${queryName}.ts`).then((m) => m.default)
  } catch {
    return addNotification({
      message: `Die Abfrage, um einen Datensatz für die Tabelle ${table} zu erstellen, scheint zu fehlen. Sorry!`,
      options: {
        variant: 'error',
      },
    })
  }
  console.log('undelete', { isWerte, table, mutation })
  try {
    await apolloClient.mutate({
      mutation: (isWerte ? (mutation as (table: string) => unknown)(table) : mutation) as import('@apollo/client').DocumentNode,
      variables: (data ?? {}) as Record<string, never>,
    })
  } catch (error) {
    console.log('undelete error:', error)
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

  if (afterDeletionHook) afterDeletionHook()
}
