// @flow
/**
* moves a dataset to a different parent
* used when copying for instance tpop to other pop in tree
*/

import axios from 'axios'
import clone from 'lodash/clone'

import apiBaseUrl from '../../modules/apiBaseUrl'
import biotopFields from '../../modules/biotopFields'
import insertDatasetInIdb from './insertDatasetInIdb'

export default (store:Object, newId:number) => {
  const { id } = store.copyingBiotop
  const row = store.table.tpopkontr.get(id)
  if (!row) {
    return store.listError(
      new Error(
        `change was not saved because dataset was not found in store`
      )
    )
  }

  // build new row (for now without idField)
  const newRow = clone(row)
  // need to remove empty values and non Biotop fields
  Object.keys(newRow).forEach((k) => {
    if (
      (!newRow[k] && newRow[k] !== 0) ||
      !biotopFields.includes(k)
    ) {
      delete newRow[k]
    }
  })

  // update db
  const url = `${apiBaseUrl}/insertFields/apflora/tabelle=tpopkontr/felder=${JSON.stringify(newRow)}`
  axios.post(url)
    .then(({ data }) => {
      // can't write to store before, because db creates id and guid
      store.writeToStore({ data: [data], table: `tpopkontr`, field: `TPopKontrId` })
      // insert this dataset in idb
      insertDatasetInIdb(store, `tpopkontr`, data)
    })
    .catch((error) =>
      store.listError(error)
    )
}
