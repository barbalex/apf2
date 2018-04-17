// @flow
// don't know why but combining this with extendStore call
// creates an error in an autorun
// maybe needed actions are not part of Store yet?
import { extendObservable, autorun, autorunAsync } from 'mobx'

import fetchDataForOpenNodes from '../action/fetchDataForOpenNodes'
import manipulateUrl from '../action/manipulateUrl'

export default (store: Object): void => {
  extendObservable(store, {
    manipulateUrl: autorun(() => manipulateUrl(store)),
    fetchDataWhenTreeOpenNodesChanges: autorunAsync(
      'fetchDataWhenTreeOpenNodesChanges',
      () => {
        // need to pass visibility of layers to make data fetched on changing layers
        const showTpop = store.map.activeApfloraLayers.includes('Tpop')
        const showPop = store.map.activeApfloraLayers.includes('Pop')
        const showBeobZugeordnet =
          store.map.activeApfloraLayers.includes('BeobZugeordnet') ||
          store.map.activeApfloraLayers.includes(
            'BeobZugeordnetAssignPolylines'
          )
        const showBeobNichtBeurteilt = store.map.activeApfloraLayers.includes(
          'BeobNichtBeurteilt'
        )
        const showBeobNichtZuzuordnen = store.map.activeApfloraLayers.includes(
          'BeobNichtZuzuordnen'
        )
        fetchDataForOpenNodes(
          store,
          store.tree,
          showPop,
          showTpop,
          showBeobZugeordnet,
          showBeobNichtBeurteilt,
          showBeobNichtZuzuordnen
        )
      }
    ),
  })
  extendObservable(store.tree2, {
    fetchDataWhenTreeOpenNodesChanges: autorunAsync(
      'fetchDataWhenTreeOpenNodesChanges',
      () => {
        // need to pass visibility of layers to make data fetched on changing layers
        const showTpop = store.map.activeApfloraLayers.includes('Tpop')
        const showPop = store.map.activeApfloraLayers.includes('Pop')
        const showBeobZugeordnet =
          store.map.activeApfloraLayers.includes('BeobZugeordnet') ||
          store.map.activeApfloraLayers.includes(
            'BeobZugeordnetAssignPolylines'
          )
        const showBeobNichtBeurteilt = store.map.activeApfloraLayers.includes(
          'BeobNichtBeurteilt'
        )
        const showBeobNichtZuzuordnen = store.map.activeApfloraLayers.includes(
          'BeobNichtZuzuordnen'
        )
        fetchDataForOpenNodes(
          store,
          store.tree2,
          showPop,
          showTpop,
          showBeobZugeordnet,
          showBeobNichtBeurteilt,
          showBeobNichtZuzuordnen
        )
      }
    ),
  })
}
