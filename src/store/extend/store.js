// @flow
import { extendObservable, action } from 'mobx'

import fetchTable from '../action/fetchTable'
import fetchBeobzuordnungModule from '../action/fetchBeobzuordnung'
import fetchTableByParentId from '../action/fetchTableByParentId'
import fetchTpopForAp from '../action/fetchTpopForAp'
import fetchPopForAp from '../action/fetchPopForAp'
import fetchDatasetById from '../action/fetchDatasetById'
import fetchBeob from '../action/fetchBeob'
import updateProperty from '../action/updateProperty'
import updatePropertyInDb from '../action/updatePropertyInDb'
import insertDataset from '../action/insertDataset'
import insertBeobzuordnung from '../action/insertBeobzuordnung'
import deleteDatasetDemand from '../action/deleteDatasetDemand'
import deleteDatasetExecute from '../action/deleteDatasetExecute'
import listError from '../action/listError'
import fetchLogin from '../action/fetchLogin'
import logout from '../action/logout'
import setLoginFromIdb from '../action/setLoginFromIdb'
import deleteBeobzuordnung from '../action/deleteBeobzuordnung'
import writeToStore from '../action/writeToStore'
import moveTo from '../action/moveTo'
import copyTo from '../action/copyTo'
import copyBiotopTo from '../action/copyBiotopTo'
import copyTpopKoordToPop from '../action/copyTpopKoordToPop'
import copyTpopBeobKoordToPop from '../action/copyTpopBeobKoordToPop'
import createNewPopFromBeob from '../action/createNewPopFromBeob'
import undoDeletion from '../action/undoDeletion'

export default (store: Object): void => {
  extendObservable(store, {
    loading: [],
    moving: {
      table: null,
      id: null,
      label: null,
    },
    markForMoving: action('markForMoving', (table, id, label) => {
      store.moving.table = table
      store.moving.id = id
      store.moving.label = label
    }),
    moveTo: action('move', newParentId => {
      // check if this is correct table is not necessary because context menu
      // only shows menu when table is correct
      // change parent id of dataset marked for moving
      moveTo(store, newParentId)
      // reset moving
      store.moving.table = null
      store.moving.id = null
      store.moving.label = null
    }),
    copying: {
      table: null,
      id: null,
      label: null,
    },
    markForCopying: action('markForCopying', (table, id, label) => {
      store.copying.table = table
      store.copying.id = id
      store.copying.label = label
    }),
    copyTo: action('copyTo', parentId => {
      // insert new dataset with:
      // - data of dataset with id copying.id
      // - parentId as passed
      copyTo(store, parentId)
    }),
    resetCopying: action('resetCopying', () => {
      store.copying.table = null
      store.copying.id = null
      store.copying.label = null
    }),
    copyingBiotop: {
      id: null,
      label: null,
    },
    markForCopyingBiotop: action('markForCopyingBiotop', (id, label) => {
      store.copyingBiotop.id = id
      store.copyingBiotop.label = label
    }),
    copyBiotopTo: action('copyBiotopTo', id => {
      // insert new dataset with:
      // - data of dataset with id copying.id
      // - id as passed
      copyBiotopTo(store, id)
    }),
    resetCopyingBiotop: action('resetCopyingBiotop', () => {
      store.copyingBiotop.id = null
      store.copyingBiotop.label = null
    }),
    copyTpopKoordToPop: action('copyTpopKoordToPop', tpopId =>
      copyTpopKoordToPop(store, tpopId)
    ),
    copyTpopBeobKoordToPop: action('copyTpopBeobKoordToPop', beobId =>
      copyTpopBeobKoordToPop(store, beobId)
    ),
    createNewPopFromBeob: action('createNewPopFromBeob', (tree, beobId) =>
      createNewPopFromBeob(store, tree, beobId)
    ),
    showCoordOnMapsZhCh: action('showCoordOnMapsZhCh', (x, y) =>
      window.open(
        `https://maps.zh.ch/?x=${x}&y=${y}&scale=3000&markers=ring`,
        'target="_blank"'
      )
    ),
    showCoordOnMapGeoAdminCh: action('showCoordOnMapGeoAdminCh', (x, y) =>
      window.open(
        `https://map.geo.admin.ch/?bgLayer=ch.swisstopo.pixelkarte-farbe&Y=${x}&X=${y}&zoom=10&crosshair=circle`,
        'target="_blank"'
      )
    ),
    /**
     * urlQueries are used to control tabs
     * for instance: Entwicklung or Biotop in tpopfeldkontr
     */
    urlQuery: {
      projekteTabs: [],
      feldkontrTab: 'entwicklung',
    },
    setUrlQuery: action('setUrlQuery', query =>
      Object.keys(query).forEach(k => (store.urlQuery[k] = query[k]))
    ),
    setUrlQueryValue: action('setUrlQueryValue', (key, value) => {
      if (!value && value !== 0) {
        delete store.urlQuery[key]
      } else {
        store.urlQuery[key] = value
      }
    }),
    datasetToDelete: {},
    tellUserReadOnly: action('tellUserReadOnly', () =>
      store.listError(new Error('Sie haben keine Schreibrechte'))
    ),
    fetchLogin: action('fetchLogin', (name, password) =>
      fetchLogin(store, name, password)
    ),
    logout: action('logout', () => logout(store)),
    setLoginFromIdb: action('setLoginFromIdb', () => setLoginFromIdb(store)),
    insertBeobzuordnung: action(
      'insertBeobzuordnung',
      (tree, newKey, newValue) => {
        if (store.user.readOnly) return store.tellUserReadOnly()
        insertBeobzuordnung(store, tree, newKey, newValue)
      }
    ),
    insertDataset: action('insertDataset', (tree, table, parentId, baseUrl) => {
      if (store.user.readOnly) return store.tellUserReadOnly()
      insertDataset(store, tree, table, parentId, baseUrl)
    }),
    deleteDatasetDemand: action(
      'deleteDatasetDemand',
      (table, id, url, label) => {
        if (store.user.readOnly) return store.tellUserReadOnly()
        deleteDatasetDemand(store, table, id, url, label)
      }
    ),
    deleteDatasetAbort: action('deleteDatasetAbort', () => {
      store.datasetToDelete = {}
    }),
    deleteDatasetExecute: action('deleteDatasetExecute', tree => {
      if (store.user.readOnly) return store.tellUserReadOnly()
      deleteDatasetExecute(store, tree)
    }),
    deletedDatasets: [],
    showDeletedDatasets: false,
    toggleShowDeletedDatasets: action('toggleShowDeletedDatasets', () => {
      store.showDeletedDatasets = !store.showDeletedDatasets
    }),
    undoDeletion: action('undoDeletion', deletedDataset => {
      undoDeletion({ store, deletedDataset })
    }),
    deleteBeobzuordnung: action('deleteBeobzuordnung', (tree, beobId) =>
      deleteBeobzuordnung(store, tree, beobId)
    ),
    listError: action('listError', error => listError(store, error)),
    // updates data in store
    updateProperty: action('updateProperty', (tree, key, value) => {
      if (store.user.readOnly) return store.tellUserReadOnly()
      updateProperty(store, tree, key, value)
    }),
    // updates data in database
    updatePropertyInDb: action('updatePropertyInDb', (tree, key, value) => {
      if (store.user.readOnly) return store.tellUserReadOnly()
      updatePropertyInDb(store, tree, key, value)
    }),
    // fetch all data of a table
    // primarily used for werte (domain) tables
    // and projekt
    fetchTable: action('fetchTable', (schemaName, tableName) =>
      fetchTable(store, schemaName, tableName)
    ),
    fetchBeobzuordnung: action('fetchBeobzuordnung', apArtId =>
      fetchBeobzuordnungModule(store, apArtId)
    ),
    // fetch data of table for id of parent table
    // used for actual apflora data (but projekt)
    fetchTableByParentId: action(
      'fetchTableByParentId',
      (schemaName, tableName, parentId) =>
        fetchTableByParentId(store, schemaName, tableName, parentId)
    ),
    fetchTpopForAp: action('fetchTpopForAp', apArtId =>
      fetchTpopForAp(store, apArtId)
    ),
    fetchPopForAp: action('fetchPopForAp', apArtId =>
      fetchPopForAp(store, apArtId)
    ),
    fetchDatasetById: action(
      'fetchDatasetById',
      ({ schemaName, tableName, id }) =>
        fetchDatasetById({ store: store, schemaName, tableName, id })
    ),
    fetchBeob: action('fetchBeob', apArtId => fetchBeob(store, apArtId)),
    writeToStore: action('writeToStore', ({ data, table, field }) =>
      writeToStore({ store: store, data, table, field })
    ),
  })
}
