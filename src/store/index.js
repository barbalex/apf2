// @flow
import { observable } from 'mobx'

import TableStore from './Table'
import ObservableHistory from './ObservableHistory'
import extendStore from './extend'

function Store(): void {
  this.history = ObservableHistory
  this.loading = []
  this.urlQuery = {
    projekteTabs: [],
    feldkontrTab: `entwicklung`
  }
  this.datasetToDelete = {}
  this.tellUserReadOnly = () => {}
  this.fetchLogin = () => {}
  this.logout = () => {}
  this.setLoginFromIdb = () => {}
  this.fetchQk = () => {}
  this.setQkFilter = () => {}
  this.addMessagesToQk = () => {}
  this.fetchFieldsFromIdb = () => {}
  this.insertBeobzuordnung = () => {}
  this.insertDataset = () => {}
  this.deleteDatasetDemand = () => {}
  this.deleteDatasetAbort = () => {}
  this.deleteDatasetExecute = () => {}
  this.deleteBeobzuordnung = () => {}
  this.listError = () => {}
  this.updateProperty = () => {}
  this.updatePropertyInDb = () => {}
  this.fetchTable = () => {}
  this.fetchStammdaten = () => {}
  this.fetchBeobzuordnung = () => {}
  this.fetchTableByParentId = () => {}
  this.fetchTpopForAp = () => {}
  this.fetchPopForAp = () => {}
  this.fetchDatasetById = () => {}
  this.fetchBeobBereitgestellt = () => {}
  this.fetchBeobEvab = () => {}
  this.fetchBeobInfospezies = () => {}
  this.writeToStore = () => {}
  this.setUrlQuery = () => {}
  this.tree = {
    name: `tree`,
    activeNodeArray: [],
    activeNodes: {},
    activeNode: null,
    activeDataset: {},
    apFilter: false,
    toggleApFilter: () => {},
    nodeLabelFilter: {},
    activeNodeFilter: {},
    applyMapFilterToTree: false,
    filteredAndSorted: {},
    node: {
      nodes: [],
      projekt: null,
      apFolder: null,
      apberuebersichtFolder: null,
      apberuebersicht: null,
      ap: null,
      qkFolder: null,
      assozartFolder: null,
      assozart: null,
      idealbiotopFolder: null,
      beobNichtZuzuordnenFolder: null,
      beobNichtZuzuordnen: null,
      beobzuordnungFolder: null,
      beobzuordnung: null,
      berFolder: null,
      ber: null,
      apberFolder: null,
      apber: null,
      erfkritFolder: null,
      erfkrit: null,
      zieljahrFolder: null,
      zieljahr: null,
      ziel: null,
      zielberFolder: null,
      zielber: null,
      popFolder: null,
      pop: null,
      popmassnberFolder: null,
      popmassnber: null,
      popberFolder: null,
      popber: null,
      tpopFolder: null,
      tpop: null,
      tpopbeobFolder: null,
      tpopbeob: null,
      tpopberFolder: null,
      tpopber: null,
      tpopfreiwkontrFolder: null,
      tpopfreiwkontr: null,
      tpopfreiwkontrzaehlFolder: null,
      tpopfreiwkontrzaehl: null,
      tpopfeldkontrFolder: null,
      tpopfeldkontr: null,
      tpopfeldkontrzaehlFolder: null,
      tpopfeldkontrzaehl: null,
      tpopmassnberFolder: null,
      tpopmassnber: null,
      tpopmassnFolder: null,
      tpopmassn: null
    }
  }
  this.tree2 = {
    name: `tree2`,
    activeNodeArray: [],
    activeNodes: {},
    activeNode: null,
    activeDataset: {},
    apFilter: false,
    toggleApFilter: () => {},
    nodeLabelFilter: {},
    activeNodeFilter: {},
    applyMapFilterToTree: false,
    filteredAndSorted: {},
    node: {
      nodes: [],
      projekt: null,
      apFolder: null,
      apberuebersichtFolder: null,
      apberuebersicht: null,
      ap: null,
      qkFolder: null,
      assozartFolder: null,
      assozart: null,
      idealbiotopFolder: null,
      beobNichtZuzuordnenFolder: null,
      beobNichtZuzuordnen: null,
      beobzuordnungFolder: null,
      beobzuordnung: null,
      berFolder: null,
      ber: null,
      apberFolder: null,
      apber: null,
      erfkritFolder: null,
      erfkrit: null,
      zieljahrFolder: null,
      zieljahr: null,
      ziel: null,
      zielberFolder: null,
      zielber: null,
      popFolder: null,
      pop: null,
      popmassnberFolder: null,
      popmassnber: null,
      popberFolder: null,
      popber: null,
      tpopFolder: null,
      tpop: null,
      tpopbeobFolder: null,
      tpopbeob: null,
      tpopberFolder: null,
      tpopber: null,
      tpopfreiwkontrFolder: null,
      tpopfreiwkontr: null,
      tpopfreiwkontrzaehlFolder: null,
      tpopfreiwkontrzaehl: null,
      tpopfeldkontrFolder: null,
      tpopfeldkontr: null,
      tpopfeldkontrzaehlFolder: null,
      tpopfeldkontrzaehl: null,
      tpopmassnberFolder: null,
      tpopmassnber: null,
      tpopmassnFolder: null,
      tpopmassn: null
    }
  }
  this.export = {
    applyNodeLabelFilterToExport: false,
    toggleApplyNodeLabelFilterToExport: () => {},
    applyActiveNodeFilterToExport: false,
    toggleApplyActiveNodeFilterToExport: () => {},
    applyMapFilterToExport: false,
    toggleApplyMapFilterToExport: () => {}
  }
  this.dropdownList = {
    adressen: [],
    apUmsetzungen: [],
    apStati: [],
    artListForAp: [],
    artnamen: [],
    popEntwicklungWerte: [],
    tpopEntwicklungWerte: [],
    apErfkritWerte: [],
    tpopmassnErfbeurtWerte: [],
    tpopApBerichtRelevantWerte: [],
    gemeinden: [],
    idbiotopuebereinstWerte: [],
    lr: [],
    zaehleinheitWerte: [],
    methodeWerte: [],
    tpopMassnTypWerte: [],
    zielTypWerte: []
  }
  this.ui = {}
  this.app = {}
  this.user = {}
  this.map = {
    bounds: [],
    mouseCoord: [],
    mouseCoordEpsg21781: [],
    pop: {},
    tpop: {},
    beob: {},
    beobNichtBeurteilt: {},
    beobNichtZuzuordnen: {},
    tpopBeob: {},
    activeBaseLayer: `OsmColor`,
    activeOverlays: [],
    activeApfloraLayers: [],
    activeOverlaysSorted: [],
    activeApfloraLayersSorted: [],
    overlays: [],
    apfloraLayers: [],
    addActiveOverlay: () => {},
    removeActiveOverlay: () => {},
    setActiveBaseLayer: () => {},
    addActiveApfloraLayer: () => {},
    removeActiveApfloraLayer: () => {},
    mapFilter: {
      filter: {
        features: []
      },
      pop: [],
      tpop: [],
      beobNichtZuzuordnen: [],
      beobNichtBeurteilt: [],
      tpopBeob: []
    },
    updateMapFilter: () => {}
  }
  this.table = TableStore
  this.valuesForWhichTableDataWasFetched = {}
  this.qk = observable.map()
  this.moving = {
    table: null,
    id: null,
    label: null
  }
  this.copying = {
    table: null,
    id: null,
    label: null
  }
  this.copyingBiotop = {
    id: null,
    label: null
  }
}

const MyStore = new Store()

extendStore(MyStore)

export default MyStore
