// @flow
import axios from 'axios'

import apiBaseUrl from '../../modules/apiBaseUrl'
import insertDatasetInIdb from './insertDatasetInIdb'

const updateBeobzuordnungData = (store, beobBereitgestellt, newKey, newValue) => {
  store.updateProperty(newKey, newValue)
  store.updatePropertyInDb(newKey, newValue)
  store.updateProperty(`NO_ISFS`, beobBereitgestellt.NO_ISFS)
  store.updatePropertyInDb(`NO_ISFS`, beobBereitgestellt.NO_ISFS)
  store.updateProperty(`QuelleId`, beobBereitgestellt.QuelleId)
  store.updatePropertyInDb(`QuelleId`, beobBereitgestellt.QuelleId)
}

const continueWithBeobBereitgestellt = (store, beobBereitgestellt, newKey, newValue) => {
  const { projekt, ap } = store.tree.activeNodes
  // set new activeNodeArray
  if (newKey === `BeobNichtZuordnen`) {
    const newActiveNodeArray = [`Projekte`, projekt, `Arten`, ap, `nicht-zuzuordnende-Beobachtungen`, beobBereitgestellt.BeobId]
    store.tree.setActiveNodeArray(newActiveNodeArray)
    updateBeobzuordnungData(store, beobBereitgestellt, newKey, newValue)
  } else if (newKey === `TPopId`) {
    // ouch. Need to get activeNodeArray for this tpop
    // Nice: tpop was already loaded for building tpop list
    const tpop = store.table.tpop.get(newValue)
    const newActiveNodeArray = [`Projekte`, projekt, `Arten`, ap, `Populationen`, tpop.PopId, `Teil-Populationen`, newValue, `Beobachtungen`, beobBereitgestellt.BeobId]
    store.tree.setActiveNodeArray(newActiveNodeArray)
    updateBeobzuordnungData(store, beobBereitgestellt, newKey, newValue)
  }
}

export default (store:Object, newKey:string, newValue:number) => {
  /**
   * newKey is either BeobNichtZuordnen or TPopId
   */
  // get data from beob_bereitgestellt in activeDataset
  const beobBereitgestellt = store.activeDataset.row
  // check if a corresponding beobzuordnung already exists
  const beobzuordnungExists = !!store.table.beobzuordnung.get(beobBereitgestellt.BeobId)
  if (beobzuordnungExists) {
    return continueWithBeobBereitgestellt(store, beobBereitgestellt, newKey, newValue)
  }
  // insert new dataset in db and fetch id
  const url = `${apiBaseUrl}/apflora/beobzuordnung/NO_NOTE/${beobBereitgestellt.BeobId}`
  axios.post(url)
    .then(({ data }) => {
      const row = data
      // insert this dataset in idb
      insertDatasetInIdb(store, `beobzuordnung`, row)
      // insert this dataset in store.table
      store.table.beobzuordnung.set(row.NO_NOTE, row)
      continueWithBeobBereitgestellt(store, beobBereitgestellt, newKey, newValue)
    })
    .catch(error => store.listError(error))
}
