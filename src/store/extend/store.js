// @flow
import {
  extendObservable,
  computed,
  action,
} from 'mobx'

import fetchTable from '../action/fetchTable'
import fetchBeobzuordnungModule from '../action/fetchBeobzuordnung'
import fetchTableByParentId from '../action/fetchTableByParentId'
import fetchTpopForAp from '../action/fetchTpopForAp'
import fetchPopForAp from '../action/fetchPopForAp'
import fetchDatasetById from '../action/fetchDatasetById'
import fetchBeobBereitgestellt from '../action/fetchBeobBereitgestellt'
import fetchBeobEvab from '../action/fetchBeobEvab'
import fetchBeobInfospezies from '../action/fetchBeobInfospezies'
import updateActiveDatasetFromActiveNodes from '../action/updateActiveDatasetFromActiveNodes'
import updateProperty from '../action/updateProperty'
import updatePropertyInDb from '../action/updatePropertyInDb'
import getUrlQuery from '../action/getUrlQuery'
import fetchFields from '../action/fetchFields'
import fetchFieldsFromIdb from '../action/fetchFieldsFromIdb'
import insertDataset from '../action/insertDataset'
import insertBeobzuordnung from '../action/insertBeobzuordnung'
import deleteDatasetDemand from '../action/deleteDatasetDemand'
import deleteDatasetExecute from '../action/deleteDatasetExecute'
import listError from '../action/listError'
import setUrlQuery from '../action/setUrlQuery'
import setQk from '../action/setQk'
import setQkFilter from '../action/setQkFilter'
import fetchQk from '../action/fetchQk'
import addMessagesToQk from '../action/addMessagesToQk'
import fetchLogin from '../action/fetchLogin'
import logout from '../action/logout'
import setLoginFromIdb from '../action/setLoginFromIdb'
import fetchStammdatenTables from '../action/fetchStammdatenTables'
import deleteBeobzuordnung from '../action/deleteBeobzuordnung'
import writeToStore from '../action/writeToStore'
import moveTo from '../action/moveTo'

export default (store:Object) => {
  extendObservable(store, {
    loading: [],
    moving: {
      table: null,
      id: null,
      label: null,
    },
    markForMoving: action(`markForMoving`, (table, id, label) => {
      store.moving.table = table
      store.moving.id = id
      store.moving.label = label
    }),
    moveTo: action(`move`, (newParentId) => {
      // check if this is correct table
      // nope, not necessary because context menu
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
    },
    /**
     * urlQueries are used to control tabs
     * for instance: Entwicklung or Biotop in tpopfeldkontr
     */
    urlQuery: computed(
      () => getUrlQuery(store.history.location.search),
      { name: `urlQuery` }
    ),
    activeDataset: computed(
      () => updateActiveDatasetFromActiveNodes(store, store.tree),
      { name: `activeDataset` }
    ),
    datasetToDelete: {},
    tellUserReadOnly: action(`tellUserReadOnly`, () =>
      store.listError(new Error(`Sie haben keine Schreibrechte`))
    ),
    fetchLogin: action(`fetchLogin`, (name, password) =>
      fetchLogin(store, name, password)
    ),
    logout: action(`logout`, () =>
      logout(store)
    ),
    setLoginFromIdb: action(`setLoginFromIdb`, () =>
      setLoginFromIdb(store)
    ),
    fetchQk: action(`fetchQk`, () => fetchQk({ store: store })),
    setQk: action(`setQk`, ({ berichtjahr, messages, filter }) =>
      setQk({ store: store, berichtjahr, messages, filter })
    ),
    setQkFilter: action(`setQkFilter`, ({ filter }) =>
      setQkFilter({ store: store, filter })
    ),
    addMessagesToQk: action(`addMessagesToQk`, ({ messages }) => {
      addMessagesToQk({ store: store, messages })
    }),
    fetchFieldsFromIdb: action(`fetchFieldsFromIdb`, () =>
      fetchFieldsFromIdb(store)
    ),
    insertBeobzuordnung: action(`insertBeobzuordnung`, (newKey, newValue) => {
      if (store.user.readOnly) return store.tellUserReadOnly()
      insertBeobzuordnung(store, newKey, newValue)
    }),
    insertDataset: action(`insertDataset`, (table, parentId, baseUrl) => {
      if (store.user.readOnly) return store.tellUserReadOnly()
      insertDataset(store, table, parentId, baseUrl)
    }),
    deleteDatasetDemand: action(`deleteDatasetDemand`, (table, id, url, label) => {
      if (store.user.readOnly) return store.tellUserReadOnly()
      deleteDatasetDemand(store, table, id, url, label)
    }),
    deleteDatasetAbort: action(`deleteDatasetAbort`, () => {
      store.datasetToDelete = {}
    }),
    deleteDatasetExecute: action(`deleteDatasetExecute`, () => {
      if (store.user.readOnly) return store.tellUserReadOnly()
      deleteDatasetExecute(store)
    }),
    deleteBeobzuordnung: action(`deleteBeobzuordnung`, (beobId) =>
      deleteBeobzuordnung(store, beobId)
    ),
    listError: action(`listError`, error =>
      listError(store, error)
    ),
    // updates data in store
    updateProperty: action(`updateProperty`, (key, value) => {
      if (store.user.readOnly) return store.tellUserReadOnly()
      updateProperty(store, key, value)
    }),
    // updates data in database
    updatePropertyInDb: action(`updatePropertyInDb`, (key, value) => {
      if (store.user.readOnly) return store.tellUserReadOnly()
      updatePropertyInDb(store, key, value)
    }),
    // fetch all data of a table
    // primarily used for werte (domain) tables
    // and projekt
    fetchTable: action(`fetchTable`, (schemaName, tableName) =>
      fetchTable(store, schemaName, tableName)
    ),
    fetchStammdaten: action(`fetchStammdaten`, () => {
      fetchFields(store)
      fetchStammdatenTables(store)
    }),
    fetchBeobzuordnung: action(`fetchBeobzuordnung`, apArtId =>
      fetchBeobzuordnungModule(store, apArtId)
    ),
    // fetch data of table for id of parent table
    // used for actual apflora data (but projekt)
    fetchTableByParentId: action(`fetchTableByParentId`, (schemaName, tableName, parentId) =>
      fetchTableByParentId(store, schemaName, tableName, parentId)
    ),
    fetchTpopForAp: action(`fetchTpopForAp`, apArtId =>
      fetchTpopForAp(store, apArtId)
    ),
    fetchPopForAp: action(`fetchPopForAp`, apArtId =>
      fetchPopForAp(store, apArtId)
    ),
    fetchDatasetById: action(`fetchDatasetById`, ({ schemaName, tableName, id }) =>
      fetchDatasetById({ store: store, schemaName, tableName, id })
    ),
    fetchBeobBereitgestellt: action(`fetchBeobBereitgestellt`, apArtId =>
      fetchBeobBereitgestellt(store, apArtId)
    ),
    fetchBeobEvab: action(`fetchBeobEvab`, apArtId =>
      fetchBeobEvab(store, apArtId)
    ),
    fetchBeobInfospezies: action(`fetchBeobInfospezies`, apArtId =>
      fetchBeobInfospezies(store, apArtId)
    ),
    writeToStore: action(
      `writeToStore`,
      ({ data, table, field }) => writeToStore({ store: store, data, table, field })
    ),
    /**
     * urlQueries are used to control tabs
     * for instance: Entwicklung or Biotop in tpopfeldkontr
     * or: tree, daten and map in projekte
     */
    setUrlQuery: action(`setUrlQuery`, (key, value) =>
      setUrlQuery(store, key, value)
    ),
  })
}
