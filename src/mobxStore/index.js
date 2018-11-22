// @flow
import { types } from 'mobx-state-tree'
import cloneDeep from 'lodash/cloneDeep'

import ApfloraLayer from './ApfloraLayer'
import MapFilter from './MapFilter'
import Copying, { defaultValue as defaultCopying } from './Copying'
import Moving, { defaultValue as defaultMoving } from './Moving'
import NodeFilter, { defaultValue as defaultNodeFilter } from './NodeFilter'
import standardApfloraLayers from '../components/Projekte/Karte/apfloraLayers'
import standardOverlays from '../components/Projekte/Karte/overlays'
import initialNodeFilterTreeValues from './NodeFilterTree/initialValues'
import User, { defaultValue as defaultUser } from './User'

// substract 3 Months to now so user sees previous year in February
const ekfRefDate = new Date().setMonth(new Date().getMonth() - 2)
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
    deletedDatasets: types.optional(types.array(types.string), []),
    toDeleteTable: types.maybeNull(types.string),
    toDeleteId: types.maybeNull(types.string),
    toDeleteLabel: types.maybeNull(types.string),
    toDeleteUrl: types.maybeNull(types.string),
    nodeFilter: types.optional(NodeFilter, defaultNodeFilter),
    user: types.optional(User, defaultUser),
    updateAvailable: types.optional(types.boolean, false),
    isPrint: types.optional(types.boolean, false),
    view: types.optional(types.string, 'normal'),
    ekfYear: types.optional(types.number, ekfYear),
    ekfAdresseId: types.optional(types.maybeNull(types.string), null),
    copying: types.optional(Copying, defaultCopying),
    moving: types.optional(Moving, defaultMoving),
  })
  // structure of these variables is not controlled
  // so need to define this as volatile
  .volatile(() => ({
    detailplaene: null,
    markierungen: null,
    ktZh: null,
    errors: [],
    toDeleteAfterDeletionHook: null,
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
  }))
  .actions(self => ({
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
    setMoving({ table, id, label }) {
      self.moving = { table, id, label }
    },
  }))

export default myTypes
