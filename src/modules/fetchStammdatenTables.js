// @flow
import tables from './tables'
import fetchStammdatenTable from './fetchStammdatenTable'

export default async (store:Object) => {
  const stammdatenTablesMetadata = tables
    .filter(t => t.stammdaten)
    // this table is listed but does not exist in db
    .filter(t => t.table !== `popmassn_erfbeurt_werte`)
  stammdatenTablesMetadata.forEach(t =>
    fetchStammdatenTable(store, t)
  )
}
