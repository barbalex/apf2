// @flow
/**
* moves a dataset to a different parent
* used when copying for instance tpop to other pop in tree
*/

import axios from 'axios'

import tables from '../../modules/tables'

export default async (store: Object, deletedDataset: Object): Promise<void> => {
  // TODO: errors out here when undeleting tpopkontr
  const { time, table, dataset } = deletedDataset
  // ensure derived data exists
  const tabelle = tables.find(t => t.table === table)
  // in tpopfeldkontr and tpopfreiwkontr need to find dbTable
  const idField = tabelle ? tabelle.idField : undefined
  if (!idField) {
    return store.listError(
      new Error('dataset not inserted because idField was not found')
    )
  }

  // remove null values
  Object.keys(dataset).forEach(
    key => dataset[key] == null && delete dataset[key]
  )

  // update db
  const url = `/insertFields/apflora/tabelle=${table}/felder=${JSON.stringify(
    dataset
  )}`
  // 1. write to db
  let response
  try {
    response = await axios.post(url)
  } catch (error) {
    store.listError(error)
  }
  // $FlowIssue
  const { data } = response
  // 2. write to store
  store.writeToStore({ data: [data], table, field: idField })
  // 3. remove from deletedDatasets
  store.deletedDatasets = store.deletedDatasets.filter(d => d.time !== time)
}
