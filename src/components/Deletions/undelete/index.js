//@flow
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'
import app from 'ampersand-app'

export default async ({
  datasetsDeleted,
  dataset,
  setShowDeletions,
  deleteState,
  errorState,
}: {
  datasetsDeleted: Array<Object>,
  dataset: Object,
  setShowDeletions: () => void,
  deleteState: Object,
  errorState: Object,
}) => {
  const { client } = app
  const { table, data, afterDeletionHook } = dataset
  // 1. create new dataset
  const queryName = `create${upperFirst(camelCase(table))}`
  let mutation
  try {
    mutation = await import(`./${queryName}`).then(m => m.default)
  } catch (error) {
    return errorState.add(
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
    return errorState.add(error)
  }

  // 2. remove dataset from datasetsDeleted
  if (datasetsDeleted.length === 1) setShowDeletions(false)
  deleteState.removeDataset(dataset.id)

  if (afterDeletionHook) afterDeletionHook()
}
