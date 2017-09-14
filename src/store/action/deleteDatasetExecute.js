// @flow
import axios from 'axios'

import tables from '../../modules/tables'

export default async (store: Object, tree: Object): Promise<void> => {
  // deleteDatasetDemand checks variables
  const { table: tablePassed, id, idField, url } = store.datasetToDelete
  let table = tablePassed
  const tableMetadata = tables.find(t => t.table === table)
  if (!tableMetadata) {
    return store.listError(
      new Error(
        `Error in action deleteDatasetDemand: no table meta data found for table "${table}"`
      )
    )
  }
  // some tables need to be translated, i.e. tpopfreiwkontr
  if (tableMetadata.dbTable) {
    table = tableMetadata.dbTable
  }
  // first get dataset from server (possible that does not yet exist in store)
  // to be able to undo
  const fetchUrl = `/schema/apflora/table/${table}/field/${idField}/value/${id}`
  let result
  try {
    result = await axios.get(fetchUrl)
  } catch (error) {
    store.listError(error)
  }
  // copy to store.deletedDatasets
  const deletedDataset = {
    table,
    dataset: result.data[0],
    time: Date.now(),
  }
  store.addDatasetToDeleted(deletedDataset)

  const deleteUrl = `/apflora/tabelle=${table}/tabelleIdFeld=${idField}/tabelleId=${id}`
  try {
    await axios.delete(deleteUrl)
  } catch (error) {
    store.listError(error)
    store.datasetToDelete = {}
  }
  // remove this dataset in store.table
  store.table[table].delete(id)
  // set new url
  url.pop()
  tree.setActiveNodeArray(url)
  store.datasetToDelete = {}
  // if zieljahr is active, need to pop again, if there is no other ziel left in same year
  if (tree.activeNodes.zieljahr && !tree.activeNodes.zielber) {
    // see if there are ziele left with this zieljahr
    const zieleWithActiveZieljahr = Array.from(
      store.table.ziel.values()
    ).filter(
      ziel =>
        ziel.ApArtId === tree.activeNodes.ap &&
        ziel.ZielJahr === tree.activeNodes.zieljahr
    )
    if (zieleWithActiveZieljahr.length === 0) {
      url.pop()
      tree.setActiveNodeArray(url)
    }
  }
}
