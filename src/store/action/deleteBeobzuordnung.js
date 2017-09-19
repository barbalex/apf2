// @flow
import axios from 'axios'

export default async (
  store: Object,
  tree: Object,
  beobId: number | string
): Promise<void> => {
  const { table } = store
  const { activeNodes } = tree
  // delete beobzuordnung
  try {
    await axios.delete(`/beobzuordnung?BeobId=eq.${beobId}`)
  } catch (error) {
    store.listError(error)
  }
  // remove this dataset in store.table
  table.beobzuordnung.delete(beobId)
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
