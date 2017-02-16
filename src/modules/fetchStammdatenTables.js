// @flow
import tables from './tables'
import fetchStammdatenTable from './fetchStammdatenTable'

export default async (store:Object) => {
  const stammdatenTablesMetadata = tables.filter(t => t.stammdaten)
  stammdatenTablesMetadata.forEach(t =>
    fetchStammdatenTable(store, t)
  )
}
