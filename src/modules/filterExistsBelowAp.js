// @flow
import apChildTables from '../modules/apChildTables'
import zielChildTables from '../modules/zielChildTables'
import popChildTables from '../modules/popChildTables'
import tpopChildTables from '../modules/tpopChildTables'

export default ({
  nodeFilterState,
  treeName,
}: {
  nodeFilterState: Object,
  treeName: string,
}) => {
  return [
    ...apChildTables,
    ...zielChildTables,
    ...popChildTables,
    ...tpopChildTables,
  ].some(table => nodeFilterState.tableIsFiltered({ treeName, table }))
}
