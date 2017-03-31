// @flow
import { observable } from 'mobx'

import tableNames from '../../modules/tableStoreNames'

const initiateObservables = (tableObject) => {
  tableNames.forEach((tableName) => {
    tableObject[tableName] = observable.map()
  })
}

const Table = {}
initiateObservables(Table)
Table.filteredAndSorted = {}

export default Table
