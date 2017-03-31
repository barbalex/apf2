// @flow
import {
  observable,
} from 'mobx'

import TableStore from './Table'
import ObservableHistory from './ObservableHistory'
import extendStore from './extend'

function Store() {
  this.history = ObservableHistory
  this.loading = []
  this.activeUrlElements = {}
  this.url = []
  this.urlQuery = {}
  this.node = {
    apFilter: false,
    toggleApFilter: null,
    nodeLabelFilter: {},
    activeNodeFilter: {},
    applyMapFilterToTree: false,
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
      tpopmassn: null,
    }
  }
  this.export = {
    applyNodeLabelFilterToExport: false,
    toggleApplyNodeLabelFilterToExport: null,
    applyActiveNodeFilterToExport: false,
    toggleApplyActiveNodeFilterToExport: null,
    applyMapFilterToExport: false,
    toggleApplyMapFilterToExport: null,
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
    mapFilter: {
      filter: {
        features: []
      },
      pop: [],
      tpop: [],
      beobNichtZuzuordnen: [],
      beobNichtBeurteilt: [],
      tpopBeob: [],
    },
    updateMapFilter: null,
  }
  this.table = TableStore
  this.valuesForWhichTableDataWasFetched = {}
  this.qk = observable.map()
}

const MyStore = new Store()

extendStore(MyStore)

export default MyStore
