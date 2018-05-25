import extendStore from './store'
import extendTree from './tree'
import extendApp from './app'
import extendMap from './map'
import extendMapPop from './mapPop'
import extendMapTpop from './mapTpop'
import extendMapBeob from './mapBeob'
import extendMapBeobNichtBeurteilt from './mapBeobNichtBeurteilt'
import extendMapBeobNichtZuzuordnen from './mapBeobNichtZuzuordnen'
import extendMapBeobZugeordnet from './mapBeobZugeordnet'

export default (store: Object): void => {
  extendStore(store)
  extendTree(store, store.tree)
  extendTree(store, store.tree2)
  extendApp(store)
  extendMap(store)
  extendMapPop(store)
  extendMapTpop(store)
  extendMapBeob(store)
  extendMapBeobNichtBeurteilt(store)
  extendMapBeobNichtZuzuordnen(store)
  extendMapBeobZugeordnet(store)
}
