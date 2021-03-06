import { types } from 'mobx-state-tree'
import cloneDeep from 'lodash/cloneDeep'
import isEqual from 'lodash/isEqual'
import queryString from 'query-string'
import { navigate } from 'gatsby'
import { getSnapshot } from 'mobx-state-tree'

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
import standardApfloraLayers from '../components/Projekte/Karte/apfloraLayers'
import { overlays as standardOverlays } from '../components/Projekte/Karte/overlays'
import initialDataFilterTreeValues from './Tree/DataFilter/initialValues'
import User, { defaultValue as defaultUser } from './User'
import Tree, { defaultValue as defaultTree } from './Tree'
import EkPlan, { defaultValue as defaultEkPlan } from './EkPlan'
import getOpenNodesFromActiveNodeArray from '../modules/getOpenNodesFromActiveNodeArray'
import exists from '../modules/exists'
import simpleTypes from './Tree/DataFilter/simpleTypes'

// substract 3 Months to now so user sees previous year in February
const ekfRefDate = new Date() //.setMonth(new Date().getMonth() - 2)
const ekfYear = new Date(ekfRefDate).getFullYear()

const myTypes = types
  .model({
    apfloraLayers: types.optional(
      types.array(ApfloraLayer),
      standardApfloraLayers,
    ),
    activeApfloraLayers: types.array(types.string),
    overlays: types.optional(types.array(ApfloraLayer), standardOverlays),
    activeOverlays: types.array(types.string),
    activeBaseLayer: types.optional(types.maybeNull(types.string), 'OsmColor'),
    idOfTpopBeingLocalized: types.optional(types.maybeNull(types.string), null),
    // setting bounds works imperatively with map.fitBounds since v3
    // but keeping bounds in store as last used bounds will be re-applied on next map opening
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
    user: types.optional(User, defaultUser),
    isPrint: types.optional(types.boolean, false),
    printingJberYear: types.optional(types.number, 0),
    view: types.optional(types.string, 'normal'),
    ekfYear: types.optional(types.number, ekfYear),
    ekfAdresseId: types.optional(types.maybeNull(types.string), null),
    ekfIds: types.array(types.string),
    ekfMultiPrint: types.optional(types.boolean, false),
    copying: types.optional(Copying, defaultCopying),
    copyingBiotop: types.optional(CopyingBiotop, defaultCopyingBiotop),
    urlQuery: types.optional(UrlQuery, defaultUrlQuery),
    moving: types.optional(Moving, defaultMoving),
    mapMouseCoordinates: types.optional(
      MapMouseCoordinates,
      defaultMapMouseCoordinates,
    ),
    hideMapControls: types.optional(types.boolean, false),
    exportFileType: types.optional(types.maybeNull(types.string), 'xlsx'),
    exportApplyMapFilter: types.optional(types.boolean, false),
    assigningBeob: types.optional(types.boolean, false),
    tree: types.optional(Tree, defaultTree),
    tree2: types.optional(Tree, defaultTree),
    ekPlan: types.optional(EkPlan, defaultEkPlan),
    showDeletions: types.optional(types.boolean, false),
    technDokuFilter: types.optional(
      types.union(types.string, types.number),
      '',
    ),
    benutzerDokuFilter: types.optional(
      types.union(types.string, types.number),
      '',
    ),
    appBarHeight: types.optional(types.number, 64),
  })
  // structure of these variables is not controlled
  // so need to define this as volatile
  .volatile(() => ({
    toDeleteAfterDeletionHook: null,
    deletedDatasets: [],
    refetch: {},
    notifications: [],
  }))
  .views((self) => ({
    get apGqlFilter() {
      const result = Object.fromEntries(
        Object.entries(getSnapshot(self.tree.dataFilter.ap))
          .filter(([key, value]) => exists(value))
          .map(([key, value]) => {
            // if is string: includes, else: equalTo
            const type = simpleTypes.ap[key]
            if (type === 'string') {
              return [key, { includes: value }]
            }
            return [key, { equalTo: value }]
          }),
      )
      // return a valid filter even if no filter criterias exist
      // but ensure it returns all rows
      if (Object.entries(result).length === 0) return { id: { isNull: false } }
      return result
    },
    get popGqlFilter() {
      const result = Object.fromEntries(
        Object.entries(getSnapshot(self.tree.dataFilter.pop))
          .filter(([key, value]) => exists(value))
          .map(([key, value]) => {
            // if is string: includes, else: equalTo
            const type = simpleTypes.pop[key]
            if (type === 'string') {
              return [key, { includes: value }]
            }
            return [key, { equalTo: value }]
          }),
      )
      // return a valid filter even if no filter criterias exist
      // but ensure it returns all rows
      if (Object.entries(result).length === 0) return { id: { isNull: false } }
      return result
    },
    get tpopGqlFilter() {
      const result = Object.fromEntries(
        Object.entries(getSnapshot(self.tree.dataFilter.tpop))
          .filter(([key, value]) => exists(value))
          .map(([key, value]) => {
            // if is string: includes, else: equalTo
            const type = simpleTypes.tpop[key]
            if (type === 'string') {
              return [key, { includes: value }]
            }
            return [key, { equalTo: value }]
          }),
      )
      // return a valid filter even if no filter criterias exist
      // but ensure it returns all rows
      if (Object.entries(result).length === 0) return { id: { isNull: false } }
      return result
    },
    get tpopmassnGqlFilter() {
      const result = Object.fromEntries(
        Object.entries(getSnapshot(self.tree.dataFilter.tpopmassn))
          .filter(([key, value]) => exists(value))
          .map(([key, value]) => {
            // if is string: includes, else: equalTo
            const type = simpleTypes.tpopmassn[key]
            if (type === 'string') {
              return [key, { includes: value }]
            }
            return [key, { equalTo: value }]
          }),
      )
      // return a valid filter even if no filter criterias exist
      // but ensure it returns all rows
      if (Object.entries(result).length === 0) return { id: { isNull: false } }
      return result
    },
    get tpopkontrGqlFilter() {
      const ek = Object.fromEntries(
        Object.entries(getSnapshot(self.tree.dataFilter.tpopfeldkontr))
          .filter(([key, value]) => exists(value))
          .map(([key, value]) => {
            // if is string: includes, else: equalTo
            const type = simpleTypes.tpopfeldkontr[key]
            if (type === 'string') {
              return [key, { includes: value }]
            }
            return [key, { equalTo: value }]
          }),
      )
      const ekf = Object.fromEntries(
        Object.entries(getSnapshot(self.tree.dataFilter.tpopfreiwkontr))
          .filter(([key, value]) => exists(value))
          .map(([key, value]) => {
            // if is string: includes, else: equalTo
            const type = simpleTypes.tpopfreiwkontr[key]
            if (type === 'string') {
              return [key, { includes: value }]
            }
            return [key, { equalTo: value }]
          }),
      )
      const k = { ...ekf, ...ek }
      // return a valid filter even if no filter criterias exist
      // but ensure it returns all rows
      if (Object.entries(k).length === 0) return { id: { isNull: false } }
      return k
    },
  }))
  .actions((self) => ({
    setPrintingJberYear(val) {
      self.printingJberYear = val
    },
    setHideMapControls(val) {
      self.hideMapControls = val
    },
    setAppBarHeight(val) {
      self.appBarHeight = val
    },
    setEkfIds(ids) {
      self.ekfIds = [...ids]
    },
    setEkfMultiPrint(val) {
      self.ekfMultiPrint = val
    },
    enqueNotification(note) {
      const key = note.options && note.options.key
      self.notifications = [
        ...self.notifications,
        {
          key: key || new Date().getTime() + Math.random(),
          ...note,
        },
      ]
    },
    removeNotification(note) {
      self.notifications = self.notifications.filter((n) => n.key !== note)
    },
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
      self.deletedDatasets = self.deletedDatasets.filter((d) => d.id !== id)
    },
    setToDelete({ table, id, label, url, afterDeletionHook }) {
      self.toDeleteTable = table
      self.toDeleteId = id
      self.toDeleteLabel = label
      // without slicing deleting ekzaehleinheit errored
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
    dataFilterClone1To2() {
      self.tree2.dataFilter = cloneDeep(self.tree.dataFilter)
    },
    dataFilterSetValue({ treeName, table, key, value }) {
      self[treeName].dataFilter[table][key] = value
    },
    dataFilterEmptyTree(treeName) {
      self[treeName].dataFilter = initialDataFilterTreeValues
    },
    dataFilterEmptyTable({ treeName, table }) {
      self[treeName].dataFilter[table] = initialDataFilterTreeValues[table]
    },
    dataFilterSetActiveTable({ treeName, activeTable }) {
      self[treeName].dataFilter.activeTable = activeTable
    },
    dataFilterTableIsFiltered({ treeName, table }) {
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
      const tableFilter = self[treeName].dataFilter[table]
      return Object.values(tableFilter).filter((v) => v || v === 0).length > 0
    },
    dataFilterTreeIsFiltered(treeName) {
      const tables = Object.keys(self[treeName].dataFilter).filter(
        (t) => t !== 'activeTable',
      )
      return tables.some((table) =>
        self.dataFilterTableIsFiltered({ treeName, table }),
      )
    },
    setUser(val) {
      self.user = val
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
    setUrlQuery({
      projekteTabs,
      popTab,
      tpopTab,
      tpopmassnTab,
      apTab,
      feldkontrTab,
      idealbiotopTab,
      qkTab,
    }) {
      const newUrlQuery = {
        projekteTabs,
        popTab,
        tpopTab,
        tpopmassnTab,
        apTab,
        feldkontrTab,
        idealbiotopTab,
        qkTab,
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
        idealbiotop: null,
        assozart: null,
        ekzaehleinheit: null,
        ekfrequenz: null,
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
