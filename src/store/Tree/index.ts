import { types, getParent } from 'mobx-state-tree'
import { isEqual } from 'es-toolkit'
import { merge } from 'es-toolkit'
import queryString from 'query-string'
import isUuid from 'is-uuid'

import { appBaseUrl } from '../../modules/appBaseUrl.ts'
import { simpleTypes as popType } from './DataFilter/pop.ts'
import { simpleTypes as tpopmassnType } from './DataFilter/tpopmassn.ts'
import { simpleTypes as tpopfeldkontrType } from './DataFilter/tpopfeldkontr.ts'
import { simpleTypes as tpopfreiwkontrType } from './DataFilter/tpopfreiwkontr.ts'

import {
  store as jotaiStore,
  addNotificationAtom,
  treeOpenNodesAtom,
  treeActiveNodeArrayAtom,
  treeProjIdInActiveNodeArrayAtom,
  treeApIdInActiveNodeArrayAtom,
  treePopIdInActiveNodeArrayAtom,
  treeTpopIdInActiveNodeArrayAtom,
  treeTpopkontrIdInActiveNodeArrayAtom,
  treeApFilterAtom,
  treeSetApFilterAtom,
  treeMapFilterAtom,
  treeSetMapFilterAtom,
  treeNodeLabelFilterAtom,
  treeDataFilterAtom,
  treeApGqlFilterAtom,
  treeApGqlFilterForTreeAtom,
  treePopGqlFilterAtom,
  treePopGqlFilterForTreeAtom,
  treeTpopGqlFilterAtom,
  treeTpopGqlFilterForTreeAtom,
  treeTpopmassnGqlFilterAtom,
  treeTpopmassnGqlFilterForTreeAtom,
  treeTpopmassnberGqlFilterForTreeAtom,
  treeTpopkontrzaehlEinheitWerteGqlFilterForTreeAtom,
  treeEkAbrechnungstypWerteGqlFilterForTreeAtom,
  treeTpopApberrelevantGrundWerteGqlFilterForTreeAtom,
  treeAdresseGqlFilterForTreeAtom,
  treeUserGqlFilterForTreeAtom,
  treeApberuebersichtGqlFilterForTreeAtom,
  treeZielGqlFilterForTreeAtom,
  treeApberGqlFilterForTreeAtom,
  treeApartGqlFilterForTreeAtom,
  treeAssozartGqlFilterForTreeAtom,
  treeErfkritGqlFilterForTreeAtom,
  treeEkfrequenzGqlFilterForTreeAtom,
  treeEkzaehleinheitGqlFilterForTreeAtom,
  treePopberGqlFilterForTreeAtom,
  treePopmassnberGqlFilterForTreeAtom,
  treeTpopkontrzaehlGqlFilterForTreeAtom,
  treeTpopberGqlFilterForTreeAtom,
  treeEkGqlFilterAtom,
  treeEkGqlFilterForTreeAtom,
  treeEkfGqlFilterAtom,
  treeEkfGqlFilterForTreeAtom,
  treeBeobGqlFilterAtom,
  treeBeobNichtBeurteiltGqlFilterForTreeAtom,
  treeBeobNichtZuzuordnenGqlFilterForTreeAtom,
  treeBeobZugeordnetGqlFilterForTreeAtom,
} from '../../JotaiStore/index.ts'

const addNotification = (notification) =>
  jotaiStore.set(addNotificationAtom, notification)

export const Tree = types
  .model('Tree', {})
  .volatile(() => ({
    // Track nodeLabelFilter changes to make getters reactive
    nodeLabelFilterVersion: 0,
    // Track apFilter changes to make getters reactive
    apFilterVersion: 0,
    // Track mapFilter changes to make getters reactive
    mapFilterVersion: 0,
    // Track dataFilter changes to make getters reactive
    dataFilterVersion: 0,
    // Track activeNodeArray changes to make getters reactive
    activeNodeArrayVersion: 0,
  }))
  .actions((self) => ({
    incrementNodeLabelFilterVersion() {
      self.nodeLabelFilterVersion += 1
    },
    incrementApFilterVersion() {
      self.apFilterVersion += 1
    },
    incrementMapFilterVersion() {
      self.mapFilterVersion += 1
    },
    incrementDataFilterVersion() {
      self.dataFilterVersion += 1
    },
    incrementActiveNodeArrayVersion() {
      self.activeNodeArrayVersion += 1
    },
    afterCreate() {
      // Subscribe to jotai atom changes and increment version to trigger mobx reactions
      jotaiStore.sub(treeNodeLabelFilterAtom, () => {
        // Use queueMicrotask to avoid synchronous mutation during jotai update
        queueMicrotask(() => {
          self.incrementNodeLabelFilterVersion()
        })
      })
      jotaiStore.sub(treeApFilterAtom, () => {
        queueMicrotask(() => {
          self.incrementApFilterVersion()
        })
      })
      jotaiStore.sub(treeMapFilterAtom, () => {
        queueMicrotask(() => {
          self.incrementMapFilterVersion()
        })
      })
      jotaiStore.sub(treeDataFilterAtom, () => {
        queueMicrotask(() => {
          self.incrementDataFilterVersion()
        })
      })
      jotaiStore.sub(treeActiveNodeArrayAtom, () => {
        queueMicrotask(() => {
          self.incrementActiveNodeArrayVersion()
        })
      })
    },
  }))
  .views((self) => ({
    get apGqlFilter() {
      return jotaiStore.get(treeApGqlFilterAtom)
    },
    get apGqlFilterForTree() {
      return jotaiStore.get(treeApGqlFilterForTreeAtom)
    },
    get popGqlFilter() {
      return jotaiStore.get(treePopGqlFilterAtom)
    },
    get popGqlFilterForTree() {
      return jotaiStore.get(treePopGqlFilterForTreeAtom)
    },
    get tpopGqlFilter() {
      return jotaiStore.get(treeTpopGqlFilterAtom)
    },
    get tpopGqlFilterForTree() {
      return jotaiStore.get(treeTpopGqlFilterForTreeAtom)
    },
    get tpopmassnGqlFilter() {
      return jotaiStore.get(treeTpopmassnGqlFilterAtom)
    },
    get tpopmassnGqlFilterForTree() {
      return jotaiStore.get(treeTpopmassnGqlFilterForTreeAtom)
    },
    get tpopmassnberGqlFilterForTree() {
      return jotaiStore.get(treeTpopmassnberGqlFilterForTreeAtom)
    },
    get tpopkontrzaehlEinheitWerteGqlFilterForTree() {
      return jotaiStore.get(treeTpopkontrzaehlEinheitWerteGqlFilterForTreeAtom)
    },
    get ekAbrechnungstypWerteGqlFilterForTree() {
      return jotaiStore.get(treeEkAbrechnungstypWerteGqlFilterForTreeAtom)
    },
    get tpopApberrelevantGrundWerteGqlFilterForTree() {
      return jotaiStore.get(treeTpopApberrelevantGrundWerteGqlFilterForTreeAtom)
    },
    get adresseGqlFilterForTree() {
      return jotaiStore.get(treeAdresseGqlFilterForTreeAtom)
    },
    get userGqlFilterForTree() {
      return jotaiStore.get(treeUserGqlFilterForTreeAtom)
    },
    get apberuebersichtGqlFilterForTree() {
      return jotaiStore.get(treeApberuebersichtGqlFilterForTreeAtom)
    },
    get zielGqlFilterForTree() {
      return jotaiStore.get(treeZielGqlFilterForTreeAtom)
    },
    get apberGqlFilterForTree() {
      return jotaiStore.get(treeApberGqlFilterForTreeAtom)
    },
    get apartGqlFilterForTree() {
      return jotaiStore.get(treeApartGqlFilterForTreeAtom)
    },
    get assozartGqlFilterForTree() {
      return jotaiStore.get(treeAssozartGqlFilterForTreeAtom)
    },
    get erfkritGqlFilterForTree() {
      return jotaiStore.get(treeErfkritGqlFilterForTreeAtom)
    },
    get ekfrequenzGqlFilterForTree() {
      return jotaiStore.get(treeEkfrequenzGqlFilterForTreeAtom)
    },
    get ekzaehleinheitGqlFilterForTree() {
      return jotaiStore.get(treeEkzaehleinheitGqlFilterForTreeAtom)
    },
    get popberGqlFilterForTree() {
      return jotaiStore.get(treePopberGqlFilterForTreeAtom)
    },
    get popmassnberGqlFilterForTree() {
      return jotaiStore.get(treePopmassnberGqlFilterForTreeAtom)
    },
    get tpopkontrzaehlGqlFilterForTree() {
      return jotaiStore.get(treeTpopkontrzaehlGqlFilterForTreeAtom)
    },
    get tpopberGqlFilterForTree() {
      return jotaiStore.get(treeTpopberGqlFilterForTreeAtom)
    },
    get ekGqlFilter() {
      return jotaiStore.get(treeEkGqlFilterAtom)
    },
    get ekGqlFilterForTree() {
      return jotaiStore.get(treeEkGqlFilterForTreeAtom)
    },
    get ekfGqlFilter() {
      return jotaiStore.get(treeEkfGqlFilterAtom)
    },
    get ekfGqlFilterForTree() {
      return jotaiStore.get(treeEkfGqlFilterForTreeAtom)
    },
    get tpopkontrGqlFilter() {
      return {
        or: [self.ekGqlFilter?.filtered, self.ekfGqlFilter.filtered],
      }
    },
    beobGqlFilter(type) {
      return jotaiStore.get(treeBeobGqlFilterAtom(type))
    },
    get beobNichtBeurteiltGqlFilterForTree() {
      return jotaiStore.get(treeBeobNichtBeurteiltGqlFilterForTreeAtom)
    },
    get beobNichtZuzuordnenGqlFilterForTree() {
      return jotaiStore.get(treeBeobNichtZuzuordnenGqlFilterForTreeAtom)
    },
    get beobZugeordnetGqlFilterForTree() {
      return jotaiStore.get(treeBeobZugeordnetGqlFilterForTreeAtom)
    },
  }))

export const defaultValue = {
  apFilter: true,
}
