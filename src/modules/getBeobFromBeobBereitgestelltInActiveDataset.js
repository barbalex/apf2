export default (store) => {
  const { activeDataset } = store
  const { row } = activeDataset
  const beob = (
    row.QuelleId === 1 ?
    store.table.beob_evab.get(row.NO_NOTE_PROJET) :
    store.table.beob_infospezies.get(parseInt(row.NO_NOTE, 10))
  )
  return beob
}
