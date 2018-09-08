// @flow
import popChildTables from '../modules/popChildTables'
import tpopChildTables from '../modules/tpopChildTables'

export default ({
  nodeFilterState,
  treeName,
}: {
  nodeFilterState: Object,
  treeName: string,
}) => {
  return ['pop', ...popChildTables, ...tpopChildTables].some(table =>
    nodeFilterState.tableIsFiltered({ treeName, table }),
  )
}
