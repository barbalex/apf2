import extendStore from './store'
import extendStoreAutoruns from './storeAutoruns'
import extendNode from './node'
import extendDropdownList from './dropdownList'
import extendApp from './app'
import extendUi from './ui'
import extendUser from './user'
import extendMap from './map'
import extendMapPop from './mapPop'
import extendMapTpop from './mapTpop'
import extendMapBeob from './mapBeob'
import extendMapBeobNichtBeurteilt from './mapBeobNichtBeurteilt'
import extendMapBeobNichtZuzuordnen from './mapBeobNichtZuzuordnen'
import extendMapTpopBeob from './mapTpopBeob'
import extendTableFilteredAndSorted from './tableFilteredAndSorted'

export default (store:Object) => {
  extendStore(store)
  extendNode(store)
  extendDropdownList(store)
  extendApp(store)
  extendUi(store)
  extendUser(store)
  extendMap(store)
  extendMapPop(store)
  extendMapTpop(store)
  extendMapBeob(store)
  extendMapBeobNichtBeurteilt(store)
  extendMapBeobNichtZuzuordnen(store)
  extendMapTpopBeob(store)
  extendTableFilteredAndSorted(store)
  extendStoreAutoruns(store)
}
