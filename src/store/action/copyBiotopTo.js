// @flow
import axios from 'axios'
import clone from 'lodash/clone'
import { toJS } from 'mobx'

import biotopFields from '../../modules/biotopFields'

export default async (store: Object, newId: number): Promise<void> => {
  const { id } = store.copyingBiotop
  const rowToGetBiotopFrom = store.table.tpopkontr.get(id)
  if (!rowToGetBiotopFrom) {
    return store.listError(
      new Error('change was not saved because dataset was not found in store')
    )
  }

  let rowToUpdate = store.table.tpopkontr.get(newId)
  const rowToUpdateBeforeUpdating = clone(rowToUpdate)
  // add biotop values from rowToGetBiotopFrom
  biotopFields.forEach(f => {
    if (rowToGetBiotopFrom[f] || rowToGetBiotopFrom[f] === 0) {
      rowToUpdate[f] = rowToGetBiotopFrom[f]
    }
  })
  rowToUpdate.MutWer = store.user.name
  rowToUpdate.MutWann = new Date().toISOString()
  const rowForDb = clone(toJS(rowToUpdate))
  // remove empty values
  Object.keys(rowForDb).forEach(k => {
    if ((!rowForDb[k] && rowForDb[k] !== 0) || rowForDb[k] === 'undefined') {
      delete rowForDb[k]
    }
  })
  // remove label: field does not exist in db, is computed
  delete rowForDb.label

  // update db
  try {
    axios.patch(`/tpopkontr?TPopKontrId=eq.${rowForDb.TPopKontrId}`, rowForDb)
  } catch (error) {
    rowToUpdate = rowToUpdateBeforeUpdating
    store.listError(error)
  }
}
