// @flow
import axios from 'axios'

import deleteDatasetInIdb from './deleteDatasetInIdb'

export default async (
  store: Object,
  tree: Object,
  beobId: number | string
): Promise<void> => {
  const { table } = store
  const { activeNodes } = tree
  // delete beobzuordnung
  const deleteUrl = `/apflora/tabelle=beobzuordnung/tabelleIdFeld=BeobId/tabelleId=${beobId}`
  try {
    await axios.delete(deleteUrl)
  } catch (error) {
    store.listError(error)
  }
  // remove this dataset in store.table
  table.beobzuordnung.delete(beobId)
  // remove from idb
  deleteDatasetInIdb(store, 'beobzuordnung', beobId)
  // set activeNodeArray to corresponding beob
  const newActiveNodeArray = [
    'Projekte',
    activeNodes.projekt,
    'Arten',
    activeNodes.ap,
    'nicht-beurteilte-Beobachtungen',
    beobId,
  ]
  tree.setActiveNodeArray(newActiveNodeArray)
}
