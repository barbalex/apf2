//@flow
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'
import app from 'ampersand-app'

export default async ({
  deletedDatasets,
  dataset,
  setShowDeletions,
  removeDeletedDatasetById,
  addError,
}: {
  deletedDatasets: Array<Object>,
  dataset: Object,
  setShowDeletions: () => void,
  removeDeletedDatasetById: Object,
  addError: () => void,
}) => {
  const { client } = app
  const { table, data, afterDeletionHook } = dataset
  // 1. create new dataset
  const queryName = `create${upperFirst(camelCase(table))}`
  let mutation
  try {
    mutation = await import(`./${queryName}`).then(m => m.default)
  } catch (error) {
    return addError(
      new Error(
        `Die Abfrage, um einen Datensatz für die Tabelle ${table} zu erstellen, scheint zu fehlen. Sorry!`,
      ),
    )
  }
  try {
    await client.mutate({
      mutation,
      variables: data,
    })
  } catch (error) {
    return addError(error)
  }

  // 2. remove dataset from deletedDatasets
  if (deletedDatasets.length === 1) setShowDeletions(false)
  removeDeletedDatasetById(dataset.id)

  if (afterDeletionHook) afterDeletionHook()
}
