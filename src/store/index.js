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
    detailplaene: null,
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
  }
  this.table = TableStore
}

const MyStore = new Store()

extendStore(MyStore)

export default MyStore