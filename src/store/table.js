// @flow
import { observable } from 'mobx'

import tableNames from '../modules/tableStoreNames'

const initiateObservables = (tableObject) => {
  tableNames.forEach((tableName) => {
    tableObject[tableName] = observable.map()
    const trueOrFalse = tableName === `projekt`
    // believe this is not used
    // TODO: use or remove
    tableObject[`${tableName}Loading`] = observable(trueOrFalse)
  })
}

const Table = {}
initiateObservables(Table)

export default Table
