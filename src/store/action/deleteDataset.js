// @flow
import axios from 'axios'

export default async ({
  store,
  table,
  idField,
  id,
}: {
  store: Object,
  table: string,
  idField: string,
  id: string | number,
}): Promise<void> => {
  // first get dataset from server (possible that does not yet exist in store)
  // to be able to undo
  let result: { data: Array<Object> }
  try {
    result = await axios.get(`/${table}?${idField}=eq.${id}`)
  } catch (error) {
    return store.listError(error)
  }
  // copy to store.deletedDatasets
  const deletedDataset = {
    table,
    dataset: result.data[0],
    time: Date.now(),
  }
  store.addDatasetToDeleted(deletedDataset)

  try {
    await axios.delete(`/${table}?${idField}=eq.${id}`)
  } catch (error) {
    store.listError(error)
    store.datasetToDelete = {}
  }
  // remove this dataset in store.table
  store.table[table].delete(id)

  // if tpop was deleted: set tpopbeob free
  if (table === 'tpop') {
    const tpopbeob = Array.from(store.table.tpopbeob.values())
    const beobzuordnungIds = tpopbeob
      .filter(b => b.tpop_id === +id)
      .map(b => b.beob_id)

    beobzuordnungIds.forEach(id => {
      store.table.tpopbeob.delete(id)
    })
  }
}
