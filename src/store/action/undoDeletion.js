// @flow
/**
* moves a dataset to a different parent
* used when copying for instance tpop to other pop in tree
*/

import axios from 'axios'
import { toJS } from 'mobx'

import tables from '../../modules/tables'
import listError from '../../modules/listError'

export default async ({
  store,
  deletedDataset,
}: {
  store: Object,
  deletedDataset: ?Object,
}): Promise<void> => {
  // TODO: errors out here when undeleting tpopkontr???
  // for unknown reason this is called first with deletedDataset = undifined
  // when second dataset is deleted
  if (!deletedDataset) return
  const { time, table, dataset } = toJS(deletedDataset)
  // ensure derived data exists
  const tabelle = tables.find(t => t.table === table)
  // in tpopfeldkontr and tpopfreiwkontr need to find dbTable
  const idField = tabelle ? tabelle.idField : undefined
  if (!idField && idField !== 0) {
    return listError(
      new Error('dataset not inserted because idField was not found')
    )
  }

  // remove null values
  Object.keys(dataset).forEach(
    key => dataset[key] == null && delete dataset[key]
  )

  // write to db
  let response: { data: Array<Object> }
  try {
    response = await axios({
      method: 'POST',
      url: `/${table}`,
      data: dataset,
      headers: {
        Prefer: 'return=representation',
      },
    })
  } catch (error) {
    listError(error)
  }
  const { data } = response
  // write to store
  store.writeToStore({ data: [data[0]], table, field: idField })
  // remove from deletedDatasets
  store.deletedDatasets = store.deletedDatasets.filter(d => d.time !== time)
}
