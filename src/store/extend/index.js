import extendStore from './store'
import extendStoreAutoruns from './storeAutoruns'
import extendTree from './tree'
import extendTree2 from './tree2'
import extendDropdownList from './dropdownList'
import extendApp from './app'
import extendUser from './user'
import extendMap from './map'
import extendMapPop from './mapPop'
import extendMapTpop from './mapTpop'
import extendMapBeob from './mapBeob'
import extendMapBeobNichtBeurteilt from './mapBeobNichtBeurteilt'
import extendMapBeobNichtZuzuordnen from './mapBeobNichtZuzuordnen'
import extendMapTpopBeob from './mapTpopBeob'
import extendExport from './export'

export default (store:Object) => {
  extendStore(store)
  extendTree(store)
  extendTree2(store)
  extendDropdownList(store)
  extendApp(store)
  extendUser(store)
  extendMap(store)
  extendMapPop(store)
  extendMapTpop(store)
  extendMapBeob(store)
  extendMapBeobNichtBeurteilt(store)
  extendMapBeobNichtZuzuordnen(store)
  extendMapTpopBeob(store)
  extendStoreAutoruns(store)
  extendExport(store)
}
