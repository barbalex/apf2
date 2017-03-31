// @flow
import {
  extendObservable,
  autorun,
  autorunAsync,
  observable,
} from 'mobx'

import fetchDataForActiveUrlElements from '../modules/fetchDataForActiveUrlElements'
import manipulateUrl from '../modules/manipulateUrl'

import TableStore from './table'
import ObservableHistory from './ObservableHistory'
import extendStore from './extendStore'
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
        // need to pass visibility of layers to make data fetched on changing layers
        const showTpop = MyStore.map.activeApfloraLayers.includes(`Tpop`)
        const showPop = MyStore.map.activeApfloraLayers.includes(`Pop`)
        const showTpopBeob = MyStore.map.activeApfloraLayers.includes(`TpopBeob`) || MyStore.map.activeApfloraLayers.includes(`TpopBeobAssignPolylines`)
        const showBeobNichtBeurteilt = MyStore.map.activeApfloraLayers.includes(`BeobNichtBeurteilt`)
        const showBeobNichtZuzuordnen = MyStore.map.activeApfloraLayers.includes(`BeobNichtZuzuordnen`)
        fetchDataForActiveUrlElements(MyStore, showPop, showTpop, showTpopBeob, showBeobNichtBeurteilt, showBeobNichtZuzuordnen)
      }
    ),
  }
)

export default MyStore
