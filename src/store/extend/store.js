// @flow
import { extendObservable, action } from 'mobx'

import fetchTable from '../action/fetchTable'
import fetchTableByParentId from '../action/fetchTableByParentId'
import fetchDatasetById from '../action/fetchDatasetById'
import updateProperty from '../action/updateProperty'
import updatePropertyInDb from '../action/updatePropertyInDb'
import writeToStore from '../action/writeToStore'
import undoDeletion from '../action/undoDeletion'

export default (store: Object): void => {
  extendObservable(store, {
    loading: [],
    datasetToDelete: {},
    deletedDatasets: [],
    addDatasetToDeleted: action('addDatasetToDeleted', dataset => {
      store.deletedDatasets = [dataset, ...store.deletedDatasets]
    }),
    undoDeletion: action('undoDeletion', deletedDataset => {
      undoDeletion({ store, deletedDataset })
    }),
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
    // fetch data of table for id of parent table
    // used for actual apflora data (but projekt)
    fetchTableByParentId: action(
      'fetchTableByParentId',
      (tableName, parentId) => fetchTableByParentId(store, tableName, parentId)
    ),
    fetchDatasetById: action('fetchDatasetById', ({ tableName, id }) =>
      fetchDatasetById({ store: store, tableName, id })
    ),
    writeToStore: action('writeToStore', ({ data, table, field }) =>
      writeToStore({ store: store, data, table, field })
    ),
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
