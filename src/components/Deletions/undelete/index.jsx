import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'

export const undelete = async ({
  deletedDatasets,
  dataset,
  setShowDeletions,
  removeDeletedDatasetById,
  client,
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
    mutation = await import(`./queries/${queryName}.js`).then((m) => m.default)
  } catch (error) {
    return store.enqueNotification({
      message: `Die Abfrage, um einen Datensatz für die Tabelle ${table} zu erstellen, scheint zu fehlen. Sorry!`,
      options: {
        variant: 'error',
      },
    })
  }
  console.log('undelete', { isWerte, table, mutation })
  try {
    await client.mutate({
      mutation: isWerte ? mutation(table) : mutation,
      variables: data,
    })
  } catch (error) {
    console.log('undelete error:', error)
    return store.enqueNotification({
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
