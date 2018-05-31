// @flow
import { extendObservable, action } from 'mobx'

import fetchTable from '../action/fetchTable'
import updateProperty from '../action/updateProperty'
import updatePropertyInDb from '../action/updatePropertyInDb'

export default (store: Object): void => {
  extendObservable(store, {
    loading: [],
    // updates data in store
    updateProperty: action('updateProperty', (tree, key, value) => {
      updateProperty(store, tree, key, value)
    }),
    // updates data in database
    updatePropertyInDb: action('updatePropertyInDb', (tree, key, value) => {
      updatePropertyInDb(store, tree, key, value)
    }),
    // fetch all data of a table
    // primarily used for werte (domain) tables
    // and projekt
    fetchTable: action('fetchTable', tableName => fetchTable(store, tableName)),
    updateAvailable: false,
    setUpdateAvailable: action(
      'setUpdateAvailable',
      (updateAvailable: boolean) => {
        if (updateAvailable) {
          store.updateAvailable = true
          setTimeout(() => {
            store.updateAvailable = false
          }, 1000 * 30)
        } else {
          store.updateAvailable = false
        }
      }
    ),
    initiated: false,
  })
}
