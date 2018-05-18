// @flow
import TableStore from './Table'
import extendStore from './extend'

function Store(): void {
  this.loading = []
  this.datasetToDelete = {}
  this.tellUserReadOnly = () => {}
  this.insertDataset = () => {}
  this.deleteDatasetDemand = () => {}
  this.deleteDatasetAbort = () => {}
  this.deleteDatasetExecute = () => {}
  this.deletedDatasets = []
  this.showDeletedDatasets = false
  this.undoDeletion = () => {}
  this.toggleShowDeletedDatasets = () => {}
  this.listError = () => {}
  this.updateProperty = () => {}
  this.updatePropertyInDb = () => {}
  this.fetchTable = () => {}
  this.fetchTableByParentId = () => {}
  this.fetchDatasetById = () => {}
  this.writeToStore = () => {}
  this.tree = {
    name: 'tree',
    activeNodeArray: [],
    setActiveNodeArray: () => {},
    setOpenNodesFromActiveNodeArray: () => {},
    cloneActiveNodeArrayToTree2: () => {},
    activeNodes: {},
    activeDataset: {},
    openNodes: [],
    apFilter: false,
    toggleApFilter: () => {},
    nodeLabelFilter: {},
    emptyNodeLabelFilter: () => {},
  }
  this.tree2 = {
    name: 'tree2',
    activeNodeArray: [],
    setActiveNodeArray: () => {},
    setOpenNodesFromActiveNodeArray: () => {},
    activeNodes: {},
    activeDataset: {},
    openNodes: [],
    apFilter: false,
    toggleApFilter: () => {},
    nodeLabelFilter: {},
  }
  this.export = {
    applyNodeLabelFilterToExport: false,
    applyActiveNodeFilterToExport: false,
    applyMapFilterToExport: false,
    toggleApplyMapFilterToExport: () => {},
    // array of names of downloads started
    // when download finishes, it's name is removed
    activeDownloads: [],
    addDownload: () => {},
    removeDownload: () => {},
    fileType: 'xlsx',
    toggleFileType: () => {},
  }
  this.app = {
    ktZh: null,
  }
  this.map = {
    bounds: [],
    mouseCoord: [],
    mouseCoordEpsg2056: [],
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
  this.moving = {
    table: null,
    id: null,
    label: null,
  }
  this.copying = {
    table: null,
    id: null,
    label: null,
    withNextLevel: false,
  }
  this.qk = {
    setMessages: () => {},
    addMessages: () => {},
    messages: [],
    loading: false,
    setLoading: () => {},
    filter: '',
    setFilter: () => {},
  }
}

const MyStore = new Store()

extendStore(MyStore)

export default MyStore