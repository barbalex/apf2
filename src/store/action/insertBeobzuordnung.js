// @flow
import axios from 'axios'

import apiBaseUrl from '../../modules/apiBaseUrl'
import insertDatasetInIdb from './insertDatasetInIdb'

const updateBeobzuordnungData = (
  store: Object,
  tree: Object,
  beobBereitgestellt: Object,
  newKey: string,
  newValue: string | number,
): void => {
  store.updateProperty(tree, newKey, newValue)
  store.updatePropertyInDb(tree, newKey, newValue)
  store.updateProperty(tree, `BeobId`, beobBereitgestellt.BeobId)
  store.updatePropertyInDb(tree, `BeobId`, beobBereitgestellt.BeobId)
  store.updateProperty(tree, `QuelleId`, beobBereitgestellt.QuelleId)
  store.updatePropertyInDb(tree, `QuelleId`, beobBereitgestellt.QuelleId)
}

const continueWithBeobBereitgestellt = (
  store: Object,
  tree: Object,
  beobBereitgestellt: Object,
  newKey: string,
  newValue: string | number,
): void => {
  const { projekt, ap } = tree.activeNodes
  // set new activeNodeArray
  if (newKey === `BeobNichtZuordnen`) {
    const newActiveNodeArray = [
      `Projekte`,
      projekt,
      `Arten`,
      ap,
      `nicht-zuzuordnende-Beobachtungen`,
      beobBereitgestellt.id,
    ]
    tree.setActiveNodeArray(newActiveNodeArray)
    updateBeobzuordnungData(store, tree, beobBereitgestellt, newKey, newValue)
  } else if (newKey === `TPopId`) {
    // ouch. Need to get activeNodeArray for this tpop
    // Nice: tpop was already loaded for building tpop list
    const tpop = store.table.tpop.get(newValue)
    const newActiveNodeArray = [
      `Projekte`,
      projekt,
      `Arten`,
      ap,
      `Populationen`,
      tpop.PopId,
      `Teil-Populationen`,
      newValue,
      `Beobachtungen`,
      beobBereitgestellt.id,
    ]
    tree.setActiveNodeArray(newActiveNodeArray)
    updateBeobzuordnungData(store, tree, beobBereitgestellt, newKey, newValue)
  }
}

export default (
  store: Object,
  tree: Object,
  newKey: string,
  newValue: number,
): void => {
  /**
   * newKey is either BeobNichtZuordnen or TPopId
   */
  // get data from beob in activeDataset
  const beobBereitgestellt = tree.activeDataset.row
  // check if a corresponding beobzuordnung already exists
  const beobzuordnungExists = !!store.table.beobzuordnung.get(
    beobBereitgestellt.id,
  )
  if (beobzuordnungExists) {
    return continueWithBeobBereitgestellt(
      store,
      tree,
      beobBereitgestellt,
      newKey,
      newValue,
    )
  }
  // insert new dataset in db and fetch id
  const url = `${apiBaseUrl}/apflora/beobzuordnung/BeobId/${beobBereitgestellt.id}`
  axios
    .post(url)
    .then(({ data: row }) => {
      // insert this dataset in idb
      insertDatasetInIdb(store, `beobzuordnung`, row)
      // insert this dataset in store.table
      store.table.beobzuordnung.set(row.BeobId, row)
      continueWithBeobBereitgestellt(
        store,
        tree,
        beobBereitgestellt,
        newKey,
        newValue,
      )
    })
    .catch(error => store.listError(error))
}
