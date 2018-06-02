// @flow
import TableStore from './Table'
import extendStore from './extend'

function Store(): void {
  this.tree = {
    activeNodes: {},
  }
  this.tree2 = {
    activeNodes: {},
  }
  this.map = {
    bounds: [],
    pop: {},
    tpop: {},
    beob: {},
    beobNichtBeurteilt: {},
    beobNichtZuzuordnen: {},
    beobZugeordnet: {},
    activeBaseLayer: 'OsmColor',
    activeOverlays: [],
    activeApfloraLayers: [],
    activeApfloraLayersSorted: [],
    apfloraLayers: [],
    detailplaene: null,
    setActiveBaseLayer: () => {},
    addActiveApfloraLayer: () => {},
    removeActiveApfloraLayer: () => {},
    mapFilter: {
      filter: {
        features: [],
      },
      pop: [],
      tpop: [],
      beobNichtZuzuordnen: [],
      beobNichtBeurteilt: [],
      beobZugeordnet: [],
    },
    updateMapFilter: () => {},
  }
  this.table = TableStore
}

const MyStore = new Store()

extendStore(MyStore)

export default MyStore