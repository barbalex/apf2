// @flow
import tables from '../../modules/tables'
import fetchStammdatenTable from './fetchStammdatenTable'

export default (store: Object): void => {
  const stammdatenTablesMetadata = tables
    // $FlowIssue
    .filter(t => t.stammdaten)
    // this table is listed but does not exist in db
    .filter(t => t.table !== 'popmassn_erfbeurt_werte')
  stammdatenTablesMetadata.forEach(t => fetchStammdatenTable(store, t))
}
