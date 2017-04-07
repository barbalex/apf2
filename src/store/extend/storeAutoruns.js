// @flow
// don't know why but combining this with extendStore call
// creates an error in an autorun
// maybe needed actions are not part of Store yet?
import {
  extendObservable,
  autorun,
  autorunAsync,
} from 'mobx'

import fetchDataForActiveNodes from '../action/fetchDataForActiveNodes'
import manipulateActiveNodeArray from '../action/manipulateActiveNodeArray'
import manipulateUrlQuery from '../action/manipulateUrlQuery'
import manipulateUrl from '../action/manipulateUrl'

export default (store:Object) => {
  extendObservable(store, {
    manipulateActiveNodeArray: autorun(
      `manipulateActiveNodeArray`,
      () => manipulateActiveNodeArray(store)
    ),
    manipulateUrlQuery: autorun(
      `manipulateUrlQuery`,
      () => manipulateUrlQuery(store)
    ),
    // manipulateUrl needs to be async so on first load
    // index.js can change activeNodeArray based on url
    // BEFORE autorun changes url
    manipulateUrl: autorunAsync(
      `manipulateUrl`,
      () => manipulateUrl(store)
    ),
    fetchDataWhenTreeActiveNodeArrayChanges: autorunAsync(
      `fetchDataWhenTreeActiveNodeArrayChanges`,
      () => {
        // need to pass visibility of layers to make data fetched on changing layers
        const showTpop = store.map.activeApfloraLayers.includes(`Tpop`)
        const showPop = store.map.activeApfloraLayers.includes(`Pop`)
        const showTpopBeob = store.map.activeApfloraLayers.includes(`TpopBeob`) || store.map.activeApfloraLayers.includes(`TpopBeobAssignPolylines`)
        const showBeobNichtBeurteilt = store.map.activeApfloraLayers.includes(`BeobNichtBeurteilt`)
        const showBeobNichtZuzuordnen = store.map.activeApfloraLayers.includes(`BeobNichtZuzuordnen`)
        fetchDataForActiveNodes(store, store.tree, showPop, showTpop, showTpopBeob, showBeobNichtBeurteilt, showBeobNichtZuzuordnen)
      }
    ),
  })
  extendObservable(store.tree2, {
    fetchDataWhenTree2ActiveNodeArrayChanges: autorunAsync(
      `fetchDataWhenTree2ActiveNodeArrayChanges`,
      () => {
        // need to pass visibility of layers to make data fetched on changing layers
        const showTpop = store.map.activeApfloraLayers.includes(`Tpop`)
        const showPop = store.map.activeApfloraLayers.includes(`Pop`)
        const showTpopBeob = store.map.activeApfloraLayers.includes(`TpopBeob`) || store.map.activeApfloraLayers.includes(`TpopBeobAssignPolylines`)
        const showBeobNichtBeurteilt = store.map.activeApfloraLayers.includes(`BeobNichtBeurteilt`)
        const showBeobNichtZuzuordnen = store.map.activeApfloraLayers.includes(`BeobNichtZuzuordnen`)
        fetchDataForActiveNodes(store, store.tree2, showPop, showTpop, showTpopBeob, showBeobNichtBeurteilt, showBeobNichtZuzuordnen)
      }
    ),
  })
}
