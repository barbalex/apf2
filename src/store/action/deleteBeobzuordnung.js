// @flow
import axios from 'axios'

export default async (
  store: Object,
  tree: Object,
  beobId: number | string
): Promise<void> => {
  const { table } = store
  const { activeNodes } = tree
  // delete tpopbeob
  try {
    await axios.delete(`/tpopbeob?beob_id=eq.${beobId}`)
  } catch (error) {
    store.listError(error)
  }
  // remove this dataset in store.table
  table.tpopbeob.delete(beobId)
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
