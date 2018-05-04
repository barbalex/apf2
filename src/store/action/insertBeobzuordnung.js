// @flow

const updateBeobzuordnungData = (
  store: Object,
  tree: Object,
  beob: Object,
  newKey: String,
  newValue: String | Number
): void => {
  store.updateProperty(tree, newKey, newValue)
  store.updatePropertyInDb(tree, newKey, newValue)
  store.updateProperty(tree, 'id', beob.id)
  store.updatePropertyInDb(tree, 'id', beob.id)
  tree.setOpenNodesFromActiveNodeArray()
}

export default async (
  store: Object,
  tree: Object,
  beob: Object,
  newKey: string,
  newValue: number
): void => {
  const { projekt, ap } = tree.activeNodes

  // set new activeNodeArray
  if (newKey === 'nicht_zuordnen') {
    const newActiveNodeArray = [
      'Projekte',
      projekt,
      'Aktionspläne',
      ap,
      'nicht-zuzuordnende-Beobachtungen',
      beob.id,
    ]
    tree.setActiveNodeArray(newActiveNodeArray)
    updateBeobzuordnungData(store, tree, beob, newKey, newValue)
  } else if (newKey === 'tpop_id') {
    // ouch. Need to get activeNodeArray for this tpop
    // Nice: tpop was already loaded for building tpop list
    const tpop = store.table.tpop.get(newValue)
    const newActiveNodeArray = [
      'Projekte',
      projekt,
      'Aktionspläne',
      ap,
      'Populationen',
      tpop.pop_id,
      'Teil-Populationen',
      newValue,
      'Beobachtungen',
      beob.id,
    ]
    tree.setActiveNodeArray(newActiveNodeArray)
    updateBeobzuordnungData(store, tree, beob, newKey, newValue)
  }
}
