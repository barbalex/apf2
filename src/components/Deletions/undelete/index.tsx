import { upperFirst } from 'es-toolkit'
import { camelCase } from 'es-toolkit'

import {
  store as jotaiStore,
  addNotificationAtom,
} from '../../../JotaiStore/index.ts'
export const undelete = async ({
  deletedDatasets,
  dataset,
  setShowDeletions,
  removeDeletedDatasetById,
  apolloClient,
  store,
}) => {
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
    return jotaiStore.set(addNotificationAtom, {
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
    return jotaiStore.set(addNotificationAtom, {
      message: error.message,
      options: {
        variant: 'error',
      },
    })
  }

  // 2. remove dataset from deletedDatasets
  if (deletedDatasets.length === 1) setShowDeletions(false)
  removeDeletedDatasetById(dataset.id)

  if (afterDeletionHook) afterDeletionHook()
}
