// @flow
import TableStore from './Table'
import extendStore from './extend'

function Store(): void {
  this.loading = []
  this.datasetToDelete = {}
  this.deleteDatasetExecute = () => {}
  this.deletedDatasets = []
  this.undoDeletion = () => {}
  this.updateProperty = () => {}
  this.updatePropertyInDb = () => {}
  this.fetchTable = () => {}
  this.fetchTableByParentId = () => {}
  this.fetchDatasetById = () => {}
  this.writeToStore = () => {}
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
    activeOverlaysSorted: [],
    activeApfloraLayersSorted: [],
    overlays: [],
    apfloraLayers: [],
    detailplaene: null,
    addActiveOverlay: () => {},
    removeActiveOverlay: () => {},
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
  this.valuesForWhichTableDataWasFetched = {}
}

const MyStore = new Store()

extendStore(MyStore)

export default MyStore