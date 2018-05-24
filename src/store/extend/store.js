// @flow
import { extendObservable, action } from 'mobx'

import fetchTable from '../action/fetchTable'
import fetchTableByParentId from '../action/fetchTableByParentId'
import fetchDatasetById from '../action/fetchDatasetById'
import updateProperty from '../action/updateProperty'
import updatePropertyInDb from '../action/updatePropertyInDb'
import insertDataset from '../action/insertDataset'
import deleteDatasetDemand from '../action/deleteDatasetDemand'
import deleteDatasetExecute from '../action/deleteDatasetExecute'
import listError from '../action/listError'
import writeToStore from '../action/writeToStore'
import copyTo from '../action/copyTo'
import copyTpopKoordToPop from '../action/copyTpopKoordToPop'
import copyBeobZugeordnetKoordToPop from '../action/copyBeobZugeordnetKoordToPop'
import createNewPopFromBeob from '../action/createNewPopFromBeob'
import undoDeletion from '../action/undoDeletion'

export default (store: Object): void => {
  extendObservable(store, {
    loading: [],
    copying: {
      table: null,
      id: null,
      label: null,
      withNextLevel: false,
    },
    copyTo: action('copyTo', (parentId, tablePassed, idPassed) => {
      // insert new dataset with:
      // - data of dataset with id copying.id
      // - parentId as passed
      // if table and id were passed, pass on
      if (tablePassed && idPassed) {
        copyTo(store, parentId, tablePassed, idPassed)
      } else {
        copyTo(store, parentId)
      }
    }),
    resetCopying: action('resetCopying', () => {
      store.copying.table = null
      store.copying.id = null
      store.copying.label = null
      store.copying.withNextLevel = false
    }),
    copyTpopKoordToPop: action('copyTpopKoordToPop', tpopId =>
      copyTpopKoordToPop(store, tpopId)
    ),
    copyBeobZugeordnetKoordToPop: action(
      'copyBeobZugeordnetKoordToPop',
      beobId => copyBeobZugeordnetKoordToPop(store, beobId)
    ),
    createNewPopFromBeob: action('createNewPopFromBeob', (tree, beobId) =>
      createNewPopFromBeob({ store, tree, beobId })
    ),
    datasetToDelete: {},
    tellUserReadOnly: action('tellUserReadOnly', () =>
      store.listError(new Error('Sie haben keine Schreibrechte'))
    ),
    insertDataset: action('insertDataset', (tree, table, parentId, baseUrl) => {
      insertDataset(store, tree, table, parentId, baseUrl)
    }),
    deleteDatasetDemand: action(
      'deleteDatasetDemand',
      (table, id, url, label) => {
        deleteDatasetDemand(store, table, id, url, label)
      }
    ),
    deleteDatasetAbort: action('deleteDatasetAbort', () => {
      store.datasetToDelete = {}
    }),
    deleteDatasetExecute: action('deleteDatasetExecute', tree => {
      deleteDatasetExecute(store, tree)
    }),
    deletedDatasets: [],
    addDatasetToDeleted: action('addDatasetToDeleted', dataset => {
      store.deletedDatasets = [dataset, ...store.deletedDatasets]
    }),
    showDeletedDatasets: false,
    toggleShowDeletedDatasets: action('toggleShowDeletedDatasets', () => {
      store.showDeletedDatasets = !store.showDeletedDatasets
    }),
    undoDeletion: action('undoDeletion', deletedDataset => {
      undoDeletion({ store, deletedDataset })
    }),
    listError: action('listError', error => listError(store, error)),
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
