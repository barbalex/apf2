import { upperFirst } from 'es-toolkit'
import { camelCase } from 'es-toolkit'

import {
  store as jotaiStore,
  addNotificationAtom,
  removeDeletedDatasetByIdAtom,
  deletedDatasetsAtom,
  apolloClientAtom,
  setShowDeletionsAtom,
} from '../../../store/index.js'

const addNotification = (notification) =>
  jotaiStore.set(addNotificationAtom, notification)

export const undelete = async ({ id }) => {
  const apolloClient = jotaiStore.get(apolloClientAtom)
  const deletedDatasets = jotaiStore.get(deletedDatasetsAtom)

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
  let mutation
  console.log('undelete queryName:', queryName)
  try {
    mutation = await import(`./queries/${queryName}.ts`).then((m) => m.default)
  } catch (error) {
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
      mutation: isWerte ? mutation(table) : mutation,
      variables: data,
    })
  } catch (error) {
    console.log('undelete error:', error)
    return addNotification({
      message: error.message,
      options: {
        variant: 'error',
      },
    })
  }

  // 2. remove dataset from deletedDatasets
  if (deletedDatasets.length === 1) jotaiStore.set(setShowDeletionsAtom, false)
  jotaiStore.set(removeDeletedDatasetByIdAtom, dataset.id)

  if (afterDeletionHook) afterDeletionHook()
}
