/* eslint-disable no-console, no-param-reassign */

import { extendObservable, action, autorun, autorunAsync, computed, observable } from 'mobx'
import $ from 'jquery'

import fetchTable from '../modules/fetchTable'
import fetchBeobzuordnungModule from '../modules/fetchBeobzuordnung'
import fetchTableByParentId from '../modules/fetchTableByParentId'
import fetchTpopForAp from '../modules/fetchTpopForAp'
import fetchDatasetById from '../modules/fetchDatasetById'
import fetchBeobBereitgestellt from '../modules/fetchBeobBereitgestellt'
import updateActiveDatasetFromUrl from '../modules/updateActiveDatasetFromUrl'
import getActiveUrlElements from '../modules/getActiveUrlElements'
import fetchDataForActiveUrlElements from '../modules/fetchDataForActiveUrlElements'
import buildProjektNodes from '../modules/nodes/projekt'
import updateProperty from '../modules/updateProperty'
import updatePropertyInDb from '../modules/updatePropertyInDb'
import manipulateUrl from '../modules/manipulateUrl'
import getUrl from '../modules/getUrl'
import getUrlQuery from '../modules/getUrlQuery'
import fetchFields from '../modules/fetchFields'
import insertDataset from '../modules/insertDataset'
import deleteDatasetDemand from '../modules/deleteDatasetDemand'
import deleteDatasetExecute from '../modules/deleteDatasetExecute'
import toggleNode from '../modules/toggleNode'
import listError from '../modules/listError'
import setUrlQuery from '../modules/setUrlQuery'
import setQk from '../modules/setQk'
import setQkFilter from '../modules/setQkFilter'
import fetchQk from '../modules/fetchQk'
import addMessagesToQk from '../modules/addMessagesToQk'

import TableStore from './table'
import ObservableHistory from './ObservableHistory'

function Store() {
  this.history = ObservableHistory
  this.node = {
    loadingAllNodes: observable(false),
    nodeLabelFilter: observable.map({}),
    nrOfRowsAboveActiveNode: observable(0),
  }
  this.ui = {
    windowWidth: observable($(window).width()),
    windowHeight: observable($(window).height()),
    treeHeight: observable(0),
    lastClickY: observable(0),
    treeTopPosition: observable(0),
  }
  this.app = {
    errors: observable([]),
    // TODO: get user else
    user: observable(`z`),
    fields: observable([]),
    fieldsLoading: observable(true),
    map: observable(null),
  }
  this.table = TableStore
  this.valuesForWhichTableDataWasFetched = {}
  this.qk = observable.map()
  extendObservable(this, {
    datasetToDelete: {},
    qkLoading: false,
    setQkLoading: action((loading) => {
      this.qkLoading = loading
    }),
    fetchQk: action(() =>
      fetchQk({ store: this })
    ),
    setQk: action(({ berichtjahr, messages, filter }) =>
      setQk({ store: this, berichtjahr, messages, filter })
    ),
    setQkFilter: action(({ filter }) =>
      setQkFilter({ store: this, filter })
    ),
    addMessagesToQk: action(({ messages }) => {
      addMessagesToQk({ store: this, messages })
    }),
    fetchFields: action(() =>
      fetchFields(this)
    ),
    updateLabelFilter: action((table, value) => {
      if (!table) {
        return this.listError(
          new Error(`nodeLabelFilter cant be updated: no table passed`)
        )
      }
      this.node.nodeLabelFilter.set(table, value)
    }),
    insertDataset: action((table, parentId, baseUrl) =>
      insertDataset(this, table, parentId, baseUrl)
    ),
    deleteDatasetDemand: action((table, id, url, label) =>
      deleteDatasetDemand(this, table, id, url, label)
    ),
    deleteDatasetAbort: action(() => {
      this.datasetToDelete = {}
    }),
    deleteDatasetExecute: action(() =>
      deleteDatasetExecute(this)
    ),
    listError: action(error =>
      listError(this, error)
    ),
    // updates data in store
    updateProperty: action((key, value) =>
      updateProperty(this, key, value)
    ),
    // updates data in database
    updatePropertyInDb: action((key, value) =>
      updatePropertyInDb(this, key, value)
    ),
    // fetch all data of a table
    // primarily used for werte (domain) tables
    // and projekt
    fetchTable: action((schemaName, tableName) =>
      fetchTable(this, schemaName, tableName)
    ),
    fetchBeobzuordnung: action(apArtId =>
      fetchBeobzuordnungModule(this, apArtId)
    ),
    // fetch data of table for id of parent table
    // used for actual apflora data (but projekt)
    fetchTableByParentId: action((schemaName, tableName, parentId) =>
      fetchTableByParentId(this, schemaName, tableName, parentId)
    ),
    fetchTpopForAp: action(apArtId =>
      fetchTpopForAp(this, apArtId)
    ),
    fetchDatasetById: action(({ schemaName, tableName, id }) =>
      fetchDatasetById({ store: this, schemaName, tableName, id })
    ),
    fetchBeobBereitgestellt: action(apArtId =>
      fetchBeobBereitgestellt(this, apArtId)
    ),
    // action when user clicks on a node in the tree
    toggleNode: action(node =>
      toggleNode(this, node)
    ),
    /**
     * urlQueries are used to control tabs
     * for instance: Entwicklung or Biotop in tpopfeldkontr
     * or: strukturbaum, daten and karte in projekte
     */
    setUrlQuery: action((key, value) =>
      setUrlQuery(this, key, value)
    ),
    /**
     * url paths are used to control tree and forms
     */
    url: computed(() =>
      getUrl(this.history.location.pathname)
    ),
    /**
     * urlQueries are used to control tabs
     * for instance: Entwicklung or Biotop in tpopfeldkontr
     */
    urlQuery: computed(() =>
      getUrlQuery(this.history.location.search)
    ),
    projektNodes: computed(() =>
      buildProjektNodes(this)
    ),
    activeDataset: computed(() =>
      updateActiveDatasetFromUrl(this)
    ),
    activeUrlElements: computed(() =>
      getActiveUrlElements(this.url)
    ),
  })
}

const MyStore = new Store()

// don't know why but combining this with last extend call
// creates an error in an autorun
// maybe needed actions are not part of Store yet?
extendObservable(
  MyStore,
  {
    manipulateUrl: autorun(
      `manipulateUrl`,
      () => manipulateUrl(MyStore)
    ),
    reactWhenUrlHasChanged: autorunAsync(
      `reactWhenUrlHasChanged`,
      () => {
        fetchDataForActiveUrlElements(MyStore)
      }
    ),
  }
)

export default MyStore
