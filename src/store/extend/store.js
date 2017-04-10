// @flow
import { extendObservable, action } from 'mobx'

import fetchTable from '../action/fetchTable'
import fetchBeobzuordnungModule from '../action/fetchBeobzuordnung'
import fetchTableByParentId from '../action/fetchTableByParentId'
import fetchTpopForAp from '../action/fetchTpopForAp'
import fetchPopForAp from '../action/fetchPopForAp'
import fetchDatasetById from '../action/fetchDatasetById'
import fetchBeobBereitgestellt from '../action/fetchBeobBereitgestellt'
import fetchBeobEvab from '../action/fetchBeobEvab'
import fetchBeobInfospezies from '../action/fetchBeobInfospezies'
import updateProperty from '../action/updateProperty'
import updatePropertyInDb from '../action/updatePropertyInDb'
import fetchFields from '../action/fetchFields'
import fetchFieldsFromIdb from '../action/fetchFieldsFromIdb'
import insertDataset from '../action/insertDataset'
import insertBeobzuordnung from '../action/insertBeobzuordnung'
import deleteDatasetDemand from '../action/deleteDatasetDemand'
import deleteDatasetExecute from '../action/deleteDatasetExecute'
import listError from '../action/listError'
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
import copyTo from '../action/copyTo'
import copyBiotopTo from '../action/copyBiotopTo'
import copyTpopKoordToPop from '../action/copyTpopKoordToPop'

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
    markForCopying: action(`markForCopying`, (table, id, label) => {
      store.copying.table = table
      store.copying.id = id
      store.copying.label = label
    }),
    copyTo: action(`copyTo`, (parentId) => {
      // insert new dataset with:
      // - data of dataset with id copying.id
      // - parentId as passed
      copyTo(store, parentId)
    }),
    resetCopying: action(`resetCopying`, () => {
      store.copying.table = null
      store.copying.id = null
      store.copying.label = null
    }),
    copyingBiotop: {
      id: null,
      label: null,
    },
    markForCopyingBiotop: action(`markForCopyingBiotop`, (id, label) => {
      store.copyingBiotop.id = id
      store.copyingBiotop.label = label
    }),
    copyBiotopTo: action(`copyBiotopTo`, (id) => {
      // insert new dataset with:
      // - data of dataset with id copying.id
      // - id as passed
      copyBiotopTo(store, id)
    }),
    resetCopyingBiotop: action(`resetCopyingBiotop`, () => {
      store.copyingBiotop.id = null
      store.copyingBiotop.label = null
    }),
    copyTpopKoordToPop: action(`copyTpopKoordToPop`, (tpopId) =>
      copyTpopKoordToPop(store, tpopId)
    ),
    /**
     * urlQueries are used to control tabs
     * for instance: Entwicklung or Biotop in tpopfeldkontr
     */
    urlQuery: {
      projekteTabs: [],
      feldkontrTab: `entwicklung`,
    },
    setUrlQuery: action(`setUrlQuery`, (query) =>
      Object.keys(query).forEach(k =>
        store.urlQuery[k] = query[k]
      )
    ),
    setUrlQueryValue: action(`setUrlQueryValue`, (key, value) => {
      if (!value && value !== 0) {
        delete store.urlQuery[key]
      } else {
        store.urlQuery[key] = value
      }
    }),
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
    fetchQk: action(`fetchQk`, ({ tree }) =>
      fetchQk({ store, tree })
    ),
    setQk: action(`setQk`, ({ tree, berichtjahr, messages, filter }) =>
      setQk({ store, tree, berichtjahr, messages, filter })
    ),
    setQkFilter: action(`setQkFilter`, ({ filter, tree }) =>
      setQkFilter({ store, tree, filter })
    ),
    addMessagesToQk: action(`addMessagesToQk`, ({ tree, messages }) => {
      addMessagesToQk({ store, tree, messages })
    }),
    fetchFieldsFromIdb: action(`fetchFieldsFromIdb`, () =>
      fetchFieldsFromIdb(store)
    ),
    insertBeobzuordnung: action(`insertBeobzuordnung`, (tree, newKey, newValue) => {
      if (store.user.readOnly) return store.tellUserReadOnly()
      insertBeobzuordnung(store, tree, newKey, newValue)
    }),
    insertDataset: action(`insertDataset`, (tree, table, parentId, baseUrl) => {
      if (store.user.readOnly) return store.tellUserReadOnly()
      insertDataset(store, tree, table, parentId, baseUrl)
    }),
    deleteDatasetDemand: action(`deleteDatasetDemand`, (table, id, url, label) => {
      if (store.user.readOnly) return store.tellUserReadOnly()
      deleteDatasetDemand(store, table, id, url, label)
    }),
    deleteDatasetAbort: action(`deleteDatasetAbort`, () => {
      store.datasetToDelete = {}
    }),
    deleteDatasetExecute: action(`deleteDatasetExecute`, (tree) => {
      if (store.user.readOnly) return store.tellUserReadOnly()
      deleteDatasetExecute(store, tree)
    }),
    deleteBeobzuordnung: action(`deleteBeobzuordnung`, (tree, beobId) =>
      deleteBeobzuordnung(store, tree, beobId)
    ),
    listError: action(`listError`, error =>
      listError(store, error)
    ),
    // updates data in store
    updateProperty: action(`updateProperty`, (tree, key, value) => {
      if (store.user.readOnly) return store.tellUserReadOnly()
      updateProperty(store, tree, key, value)
    }),
    // updates data in database
    updatePropertyInDb: action(`updatePropertyInDb`, (tree, key, value) => {
      if (store.user.readOnly) return store.tellUserReadOnly()
      updatePropertyInDb(store, tree, key, value)
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
  })
}
