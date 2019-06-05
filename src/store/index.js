import { types } from 'mobx-state-tree'
import cloneDeep from 'lodash/cloneDeep'
import isEqual from 'lodash/isEqual'
import uniqBy from 'lodash/uniqBy'
import queryString from 'query-string'
import { navigate } from 'gatsby'

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
import getOpenNodesFromActiveNodeArray from '../modules/getOpenNodesFromActiveNodeArray'

// substract 3 Months to now so user sees previous year in February
const ekfRefDate = new Date() //.setMonth(new Date().getMonth() - 2)
const ekfYear = new Date(ekfRefDate).getFullYear()

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
    showDeletions: types.optional(types.boolean, false),
    technDokuFilter: types.optional(
      types.union(types.string, types.number),
      '',
    ),
    benutzerDokuFilter: types.optional(
      types.union(types.string, types.number),
      '',
    ),
  })
  // structure of these variables is not controlled
  // so need to define this as volatile
  .volatile(() => ({
    detailplaene: null,
    markierungen: null,
    ktZh: null,
    errors: [],
    toDeleteAfterDeletionHook: null,
    deletedDatasets: [],
    refetch: {},
  }))
  .views(self => ({
    get treeActiveNodes() {
      return getActiveNodes(self.tree.activeNodeArray)
    },
    get tree2ActiveNodes() {
      return getActiveNodes(self.tree2.activeNodeArray)
    },
  }))
  .actions(self => ({
    setTechnDokuFilter(val) {
      self.technDokuFilter = val
    },
    setBenutzerDokuFilter(val) {
      self.benutzerDokuFilter = val
    },
    setShowDeletions(val) {
      self.showDeletions = val
    },
    setDeletedDatasets(val) {
      self.deletedDatasets = val
    },
    addDeletedDataset(val) {
      self.deletedDatasets = [...self.deletedDatasets, val]
    },
    removeDeletedDatasetById(id) {
      self.deletedDatasets = self.deletedDatasets.filter(d => d.id !== id)
    },
    setToDelete({ table, id, label, url, afterDeletionHook }) {
      self.toDeleteTable = table
      self.toDeleteId = id
      self.toDeleteLabel = label
      // without slicing deleting ekfzaehleinheit errored
      self.toDeleteUrl = url.slice()
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
      // cannnot pop, need to set new value
      // or the change will not be observed
      // use uniq in case multiple same messages arrive
      self.errors = uniqBy([...self.errors, error], 'message')
      setTimeout(() => {
        // need to use an action inside timeout
        self.popError()
      }, 1000 * 10)
    },
    popError() {
      // eslint-disable-next-line no-unused-vars
      const [first, ...last] = self.errors
      self.errors = [...last]
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
        navigate(`/Daten/${activeNodeArray.join('/')}${query}`)
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
    setRefetchKey({ key, value }) {
      self.refetch[key] = value
    },
    cloneTree2From1() {
      self.tree2 = cloneDeep(self.tree)
    },
    openTree2WithActiveNodeArray(activeNodeArray) {
      const openNodes = getOpenNodesFromActiveNodeArray(activeNodeArray)
      self.tree2 = { ...defaultTree, activeNodeArray, openNodes }
      self.urlQuery.addProjekteTab('tree2')
      self.urlQuery.addProjekteTab('daten2')
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
  }))

export default myTypes
