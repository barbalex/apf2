import { types } from 'mobx-state-tree'

import { ApfloraLayer } from './ApfloraLayer.js'
import { Copying, defaultValue as defaultCopying } from './Copying.js'
import {
  CopyingBiotop,
  defaultValue as defaultCopyingBiotop,
} from './CopyingBiotop.js'
import { Map, defaultValue as defaultMap } from './Map.js'
import { Moving, defaultValue as defaultMoving } from './Moving.js'
import {
  MapMouseCoordinates,
  defaultValue as defaultMapMouseCoordinates,
} from './MapMouseCoordinates.js'
import { standardApfloraLayers } from '../components/Projekte/Karte/apfloraLayers.js'
import { overlays as standardOverlays } from '../components/Projekte/Karte/overlays.js'
import { User, defaultValue as defaultUser } from './User.js'
import { Tree, defaultValue as defaultTree } from './Tree/index.js'
import { EkPlan, defaultValue as defaultEkPlan } from './EkPlan/index.js'

const defaultSortedBeobFields = [
  'taxon',
  'ESPECE',
  'presence',
  'PRESENCE',
  'xy_radius',
  'abundance_cat',
  'abundance',
  'CAT_ABONDANCE_1',
  'XY_PRECISION',
  'observers',
  'NOM_PERSONNE_OBS',
  'PRENOM_PERSONNE_OBS',
  'obs_day',
  'obs_month',
  'obs_year',
  'J_NOTE',
  'M_NOTE',
  'A_NOTE',
  'remarks',
  'locality_descript',
  'DESC_LOCALITE',
  'DESC_LOCALITE_',
  'municipality',
  'canton',
  'NOM_COMMUNE',
  'CO_CANTON',
  'interpretation_note',
  'doubt_status',
  'phenology_code',
  'count_unit',
  'obs_type',
  'original_taxon',
  'taxon_expert',
  'determinavit_cf',
  'specimen_type',
  'NOM_ORIGINAL',
  'NOM_COMPLET',
  'introduction',
  'DETERMINAVIT_CF',
  'DETERMINAVIT_CF_',
  'x_swiss',
  'y_swiss',
  'COORDONNEE_FED_E',
  'COORDONNEE_FED_N',
  'FNS_XGIS',
  'FNS_YGIS',
  'STATION',
]

export const MobxStore = types
  .model({
    apfloraLayers: types.optional(
      types.array(ApfloraLayer),
      standardApfloraLayers,
    ),
    activeApfloraLayers: types.array(types.string),
    showApfLayersForMultipleAps: types.optional(types.boolean, false),
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
    toDeleteTable: types.maybeNull(types.string),
    toDeleteId: types.maybeNull(types.string),
    toDeleteLabel: types.maybeNull(types.string),
    toDeleteUrl: types.maybeNull(
      types.array(types.union(types.string, types.number)),
    ),
    user: types.optional(User, defaultUser),
    isPrint: types.optional(types.boolean, false),
    isEkfSinglePrint: types.optional(types.boolean, false),
    printingJberYear: types.optional(types.number, 0),
    copying: types.optional(Copying, defaultCopying),
    copyingBiotop: types.optional(CopyingBiotop, defaultCopyingBiotop),
    moving: types.optional(Moving, defaultMoving),
    mapMouseCoordinates: types.optional(
      MapMouseCoordinates,
      defaultMapMouseCoordinates,
    ),
    hideMapControls: types.optional(types.boolean, false),
    exportFileType: types.optional(types.maybeNull(types.string), 'xlsx'),
    assigningBeob: types.optional(types.boolean, false),
    tree: types.optional(Tree, defaultTree),
    ekPlan: types.optional(EkPlan, defaultEkPlan),
    showDeletions: types.optional(types.boolean, false),
    dokuFilter: types.optional(types.union(types.string, types.number), ''),
    map: types.optional(Map, defaultMap),
    sortedBeobFields: types.optional(
      types.array(types.string),
      defaultSortedBeobFields,
    ),
  })
  // structure of these variables is not controlled
  // so need to define this as volatile
  .volatile(() => ({
    toDeleteAfterDeletionHook: null,
    deletedDatasets: [],
    notifications: [],
    // apollographql client
    client: null,
    // tanstack query client
    queryClient: null,
    navigate: undefined,
  }))
  .actions((self) => ({
    setSortedBeobFields(val) {
      self.sortedBeobFields = val.filter((v) => !!v)
    },
    setNavigate(val) {
      self.navigate = val
    },
    setClient(val) {
      self.client = val
    },
    setQueryClient(val) {
      self.queryClient = val
    },
    setPrintingJberYear(val) {
      self.printingJberYear = val
    },
    setHideMapControls(val) {
      self.hideMapControls = val
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
    setDokuFilter(val) {
      self.dokuFilter = val
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
    toggleShowApfLayersForMultipleAps() {
      self.showApfLayersForMultipleAps = !self.showApfLayersForMultipleAps
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
    tableIsFiltered(table) {
      // check nodeLabelFilter
      const nodeLabelFilterExists = !!self.tree.nodeLabelFilter[table]
      if (nodeLabelFilterExists) return true
      // check mapFilter in tables with (parent) coordinates
      if (
        [
          'pop',
          'tpop',
          'tpopfeldkontr',
          'tpopfreiwkontr',
          'tpopmassn',
        ].includes(table) &&
        self.tree.mapFilter
      ) {
        return true
      }
      // check data and hierarchy filter: is included in gqlFilter
      // check gql filter
      const gqlFilter =
        self.tree?.[`${table}GqlFilter`]?.filtered?.or?.[0] ?? {}
      const isGqlFilter = Object.keys(gqlFilter).length > 0
      return isGqlFilter
    },
    dataFilterTreeIsFiltered() {
      const tables = Object.keys(self.tree.dataFilter)
      return tables.some((table) => self.tableIsFiltered(table))
    },
    setUser(val) {
      self.user = val
    },
    setIsPrint(val) {
      self.isPrint = val
    },
    setIsEkfSinglePrint(val) {
      self.isEkfSinglePrint = val
    },
    setCopying({ table, id, label, withNextLevel }) {
      self.copying = { table, id, label, withNextLevel }
    },
    setCopyingBiotop({ id, label }) {
      self.copyingBiotop = { id, label }
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
    setAssigningBeob(val) {
      self.assigningBeob = val
    },
    openTree2WithActiveNodeArray({
      activeNodeArray,
      search,
      projekteTabs,
      setProjekteTabs,
      onlyShowActivePath,
    }) {
      self.tree.setTree2SrcByActiveNodeArray({
        activeNodeArray,
        search,
        onlyShowActivePath,
      })
      setProjekteTabs([...projekteTabs, 'tree2', 'daten2'])
    },
    treeNodeLabelFilterResetExceptAp() {
      self.tree.nodeLabelFilter = {
        ap: self.tree.nodeLabelFilter.ap,
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
