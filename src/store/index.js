// @flow
import {
  observable,
} from 'mobx'

import TableStore from './table'
import ObservableHistory from './ObservableHistory'
import extendStore from './extendStore'
import extendStoreAutoruns from './extendStoreAutoruns'
import extendNode from './extendNode'
import extendDropdownList from './extendDropdownList'
import extendApp from './extendApp'
import extendUi from './extendUi'
import extendUser from './extendUser'
import extendMap from './extendMap'
import extendMapPop from './extendMapPop'
import extendMapTpop from './extendMapTpop'
import extendMapBeob from './extendMapBeob'
import extendMapBeobNichtBeurteilt from './extendMapBeobNichtBeurteilt'
import extendMapBeobNichtZuzuordnen from './extendMapBeobNichtZuzuordnen'
import extendMapTpopBeob from './extendMapTpopBeob'
import extendTableFilteredAndSorted from './extendTableFilteredAndSorted'

function Store() {
  this.history = ObservableHistory
  this.loading = []
  this.activeUrlElements = {}
  this.urlQuery = {}
  this.node = {
    apFilter: false,
    toggleApFilter: null,
    nodeLabelFilter: {},
    applyNodeLabelFilterToExport: false,
    toggleApplyNodeLabelFilterToExport: null,
    activeNodeFilter: {},
    applyActiveNodeFilterToExport: false,
    nodeMapFilter: {
      filter: {
        features: []
      },
      pop: [],
      tpop: [],
      beobNichtZuzuordnen: [],
      beobNichtBeurteilt: [],
      tpopBeob: [],
    },
    applyMapFilterToExport: false,
    applyMapFilterToTree: false,
    node: {
      nodes: [],
    }
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
    zielTypWerte: [],
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
  }
  this.table = TableStore
  this.valuesForWhichTableDataWasFetched = {}
  this.qk = observable.map()
}

const MyStore = new Store()

extendStore(MyStore)
extendNode(MyStore)
extendDropdownList(MyStore)
extendApp(MyStore)
extendUi(MyStore)
extendUser(MyStore)
extendMap(MyStore)
extendMapPop(MyStore)
extendMapTpop(MyStore)
extendMapBeob(MyStore)
extendMapBeobNichtBeurteilt(MyStore)
extendMapBeobNichtZuzuordnen(MyStore)
extendMapTpopBeob(MyStore)
extendTableFilteredAndSorted(MyStore)
extendStoreAutoruns(MyStore)

export default MyStore
