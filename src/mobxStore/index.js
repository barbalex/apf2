// @flow
import { types } from 'mobx-state-tree'
import cloneDeep from 'lodash/cloneDeep'
import isEqual from 'lodash/isEqual'
import queryString from 'query-string'
import createHistory from 'history/createBrowserHistory'

import ApfloraLayer from './ApfloraLayer'
import MapFilter from './MapFilter'
import Copying, { defaultValue as defaultCopying } from './Copying'
import CopyingBiotop, {
  defaultValue as defaultCopyingBiotop,
} from './CopyingBiotop'
import UrlQuery, { defaultValue as defaultUrlQuery } from './UrlQuery'
import Moving, { defaultValue as defaultMoving } from './Moving'
import MapMouseCoordinates, {
  defaultValue as defaultMapMouseCoordinates,
} from './MapMouseCoordinates'
import NodeFilter, { defaultValue as defaultNodeFilter } from './NodeFilter'
import standardApfloraLayers from '../components/Projekte/Karte/apfloraLayers'
import standardOverlays from '../components/Projekte/Karte/overlays'
import initialNodeFilterTreeValues from './NodeFilterTree/initialValues'
import User, { defaultValue as defaultUser } from './User'
import Tree, { defaultValue as defaultTree } from './Tree'
import getActiveNodes from '../modules/getActiveNodes'

// substract 3 Months to now so user sees previous year in February
const ekfRefDate = new Date().setMonth(new Date().getMonth() - 2)
const ekfYear = new Date(ekfRefDate).getFullYear()
const history = createHistory()

const myTypes = types
  .model({
    apfloraLayers: types.optional(
      types.array(ApfloraLayer),
      standardApfloraLayers,
    ),
    activeApfloraLayers: types.optional(types.array(types.string), []),
    overlays: types.optional(types.array(ApfloraLayer), standardOverlays),
    activeOverlays: types.optional(types.array(types.string), []),
    activeBaseLayer: types.optional(types.string, 'OsmColor'),
    popLabelUsingNr: types.optional(types.boolean, true),
    tpopLabelUsingNr: types.optional(types.boolean, true),
    idOfTpopBeingLocalized: types.optional(types.maybeNull(types.string), null),
    bounds: types.optional(types.array(types.array(types.number)), [
      [47.159, 8.354],
      [47.696, 8.984],
    ]),
    mapFilter: types.optional(MapFilter, {
      features: [],
      type: 'FeatureCollection',
    }),
    toDeleteTable: types.maybeNull(types.string),
    toDeleteId: types.maybeNull(types.string),
    toDeleteLabel: types.maybeNull(types.string),
    toDeleteUrl: types.maybeNull(
      types.array(types.union(types.string, types.number)),
    ),
    nodeFilter: types.optional(NodeFilter, defaultNodeFilter),
    user: types.optional(User, defaultUser),
    updateAvailable: types.optional(types.boolean, false),
    isPrint: types.optional(types.boolean, false),
    view: types.optional(types.string, 'normal'),
    ekfYear: types.optional(types.number, ekfYear),
    ekfAdresseId: types.optional(types.maybeNull(types.string), null),
    copying: types.optional(Copying, defaultCopying),
    copyingBiotop: types.optional(CopyingBiotop, defaultCopyingBiotop),
    urlQuery: types.optional(UrlQuery, defaultUrlQuery),
    moving: types.optional(Moving, defaultMoving),
    mapMouseCoordinates: types.optional(
      MapMouseCoordinates,
      defaultMapMouseCoordinates,
    ),
    exportFileType: types.optional(types.maybeNull(types.string), 'xlsx'),
    exportApplyMapFilter: types.optional(types.boolean, false),
    assigningBeob: types.optional(types.boolean, false),
    tree: types.optional(Tree, defaultTree),
    tree2: types.optional(Tree, defaultTree),
  })
  // structure of these variables is not controlled
  // so need to define this as volatile
  .volatile(() => ({
    detailplaene: null,
    markierungen: null,
    ktZh: null,
    errors: [],
    toDeleteAfterDeletionHook: null,
    history,
    deletedDatasets: [],
  }))
  .views(self => ({
    get toDelete() {
      return {
        table: self.toDeleteTable,
        id: self.toDeleteId,
        label: self.toDeleteLabel,
        url: self.toDeleteUrl,
        afterDeletionHook: self.toDeleteAfterDeletionHook,
      }
    },
    get treeActiveNodes() {
      return getActiveNodes(self.tree.activeNodeArray)
    },
    get tree2ActiveNodes() {
      return getActiveNodes(self.tree2.activeNodeArray)
    },
  }))
  .actions(self => ({
    historyPush(val) {
      history.push(val)
    },
    historyGoBack() {
      history.goBack()
    },
    setDeletedDatasets(val) {
      self.deletedDatasets = val
    },
    addDeletedDataset(val) {
      self.deletedDatasets.push(val)
    },
    removeDeletedDatasetById(id) {
      self.deletedDatasets = self.deletedDatasets.filter(d => d.id !== id)
    },
    setToDelete({ table, id, label, url, afterDeletionHook }) {
      self.toDeleteTable = table
      self.toDeleteId = id
      self.toDeleteLabel = label
      self.toDeleteUrl = url
      self.toDeleteAfterDeletionHook = afterDeletionHook
    },
    emptyToDelete() {
      self.toDeleteTable = null
      self.toDeleteId = null
      self.toDeleteLabel = null
      self.toDeleteUrl = null
      self.toDeleteAfterDeletionHook = null
    },
    setApfloraLayers(val) {
      self.apfloraLayers = val
    },
    setActiveApfloraLayers(val) {
      self.activeApfloraLayers = val
    },
    setOverlays(val) {
      self.overlays = val
    },
    setActiveOverlays(val) {
      self.activeOverlays = val
    },
    setActiveBaseLayer(val) {
      self.activeBaseLayer = val
    },
    setPopLabelUsingNr(val) {
      self.popLabelUsingNr = val
    },
    setTpopLabelUsingNr(val) {
      self.tpopLabelUsingNr = val
    },
    setIdOfTpopBeingLocalized(val) {
      self.idOfTpopBeingLocalized = val
    },
    setBounds(val) {
      self.bounds = val
    },
    setMapFilter(val) {
      self.mapFilter = val
    },
    setDetailplaene(val) {
      self.detailplaene = val
    },
    setMarkierungen(val) {
      self.markierungen = val
    },
    setKtZh(val) {
      self.ktZh = val
    },
    addError(error) {
      self.errors.push(error)
      setTimeout(() => self.errors.pop(), 1000 * 10)
    },
    nodeFilterSet({ treeName, nodeFilter }) {
      self.nodeFilter[treeName] = nodeFilter
    },
    nodeFilterClone1To2() {
      self.nodeFilter.tree2 = cloneDeep(self.nodeFilter.tree)
    },
    nodeFilterSetValue({ treeName, table, key, value }) {
      self.nodeFilter[treeName][table][key] = value
    },
    nodeFilterEmptyTree(treeName) {
      self.nodeFilter[treeName] = initialNodeFilterTreeValues
    },
    nodeFilterEmptyTable({ treeName, table }) {
      self.nodeFilter[treeName][table] = initialNodeFilterTreeValues[table]
    },
    nodeFilterSetActiveTable({ treeName, activeTable }) {
      self.nodeFilter[treeName].activeTable = activeTable
    },
    nodeFilterTableIsFiltered({ treeName, table }) {
      if (
        ![
          'ap',
          'pop',
          'tpop',
          'tpopfeldkontr',
          'tpopfreiwkontr',
          'tpopmassn',
        ].includes(table)
      ) {
        // there exist no filter for this table
        return false
      }
      const tableFilter = self.nodeFilter[treeName][table]
      return Object.values(tableFilter).filter(v => v || v === 0).length > 0
    },
    nodeFilterTreeIsFiltered(treeName) {
      const tables = Object.keys(self.nodeFilter[treeName]).filter(
        t => t !== 'activeTable',
      )
      return tables.some(table =>
        self.nodeFilterTableIsFiltered({ treeName, table }),
      )
    },
    setUser(val) {
      self.user = val
    },
    setUpdateAvailable(val) {
      self.updateAvailable = val
    },
    setIsPrint(val) {
      self.isPrint = val
    },
    setView(val) {
      self.view = val
    },
    setEkfYear(val) {
      self.ekfYear = val
    },
    setEkfAdresseId(val) {
      self.ekfAdresseId = val
    },
    setCopying({ table, id, label, withNextLevel }) {
      self.copying = { table, id, label, withNextLevel }
    },
    setCopyingBiotop({ id, label }) {
      self.copyingBiotop = { id, label }
    },
    setUrlQuery({ projekteTabs, feldkontrTab }) {
      const newUrlQuery = {
        projekteTabs,
        feldkontrTab,
      }
      // only write if changed
      if (!isEqual(self.urlQuery, newUrlQuery)) {
        self.urlQuery = newUrlQuery
        const search = queryString.stringify(newUrlQuery)
        const query = `${
          Object.keys(newUrlQuery).length > 0 ? `?${search}` : ''
        }`
        const { activeNodeArray } = self.tree
        self.historyPush(`/${activeNodeArray.join('/')}${query}`)
      }
    },
    setMoving({ table, id, label }) {
      self.moving = { table, id, label }
    },
    setMapMouseCoordinates({ x, y }) {
      self.mapMouseCoordinates = { x, y }
    },
    setExportFileType(val) {
      self.exportFileType = val
    },
    setExportApplyMapFilter(val) {
      self.exportApplyMapFilter = val
    },
    setAssigningBeob(val) {
      self.assigningBeob = val
    },
    setTreeKey({ tree, key, value }) {
      const oldValue = self[tree][key]
      const { urlQuery } = self
      // only write if changed
      if (!isEqual(oldValue, value)) {
        self[tree][key] = value
        if (tree === 'tree' && key === 'activeNodeArray') {
          const search = queryString.stringify(urlQuery)
          const query = `${
            Object.keys(urlQuery).length > 0 ? `?${search}` : ''
          }`
          // pass openNodes as state
          self.historyPush(`/${value.join('/')}${query}`, {
            openNodes: self[tree].openNodes,
          })
        }
      }
    },
    cloneTree2From1() {
      self.tree2 = cloneDeep(self.tree)
    },
    setTreeNodeLabelFilterKey({ tree, key, value }) {
      const oldValue = self[tree].nodeLabelFilter[key]
      // only write if changed
      if (!isEqual(oldValue, value)) {
        self[tree].nodeLabelFilter[key] = value
      }
    },
    treeNodeLabelFilterResetExceptAp({ tree }) {
      self[tree].nodeLabelFilter = {
        ap: self[tree].nodeLabelFilter.ap,
        pop: null,
        tpop: null,
        tpopkontr: null,
        tpopfeldkontr: null,
        tpopfreiwkontr: null,
        tpopkontrzaehl: null,
        tpopmassn: null,
        ziel: null,
        zielber: null,
        erfkrit: null,
        apber: null,
        apberuebersicht: null,
        ber: null,
        idealbiotop: null,
        assozart: null,
        ekfzaehleinheit: null,
        popber: null,
        popmassnber: null,
        tpopber: null,
        tpopmassnber: null,
        apart: null,
        projekt: null,
        beob: null,
        beobprojekt: null,
        adresse: null,
        gemeinde: null,
        user: null,
      }
    },
    setTreeMapKey({ tree, key, value }) {
      const oldValue = self[tree].map[key]
      // only write if changed
      if (!isEqual(oldValue, value)) {
        self[tree].map[key] = value
      }
    },
  }))

export default myTypes
