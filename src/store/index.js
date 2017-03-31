// @flow
import {
  observable,
} from 'mobx'

import TableStore from './table'
import ObservableHistory from './ObservableHistory'
import extendStore from './extend'

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

export default MyStore
