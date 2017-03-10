export default (store) => {
  const { activeDataset } = store
  const { row, table } = activeDataset
  const idFieldNameForEvab = table === `beob_bereitgestellt` ? `NO_NOTE_PROJET` : `NO_NOTE`
  const beob = (
    row.QuelleId === 1 ?
    store.table.beob_evab.get(row[idFieldNameForEvab]) :
    store.table.beob_infospezies.get(parseInt(row.NO_NOTE, 10))
  )

  return beob
}
