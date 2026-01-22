import localForage from 'localforage'
//import { onPatch } from 'mobx-state-tree'
import { persist } from 'mst-persist'

import { isObject } from './isObject.ts'
import {
  store as jotaiStore,
  navigateAtom,
  userNameAtom,
  treeActiveNodeArrayAtom,
  treeDataFilterAtom,
  treeDataFilterEmptyAtom,
} from '../JotaiStore/index.ts'

const blacklist = [
  'overlays', // 2022.10.26 added overlay. Need to refresh or users will not get new ones
]

export const persistStore = (store) => {
  const username = jotaiStore.get(userNameAtom)
  const navigate = jotaiStore.get(navigateAtom)

  const visitedTopDomain = window.location.pathname === '/'

  persist('store', store, {
    storage: localForage,
    jsonify: false,
    blacklist,
  }).then(async () => {
    /**
     * TODO:
     * This is temporary after rebuilding the structure of dataFilter
     * Goal: prevent errors because previous persisted structure was invalid
     * Idea: test if is object. Only then empty
     */
    const dataFilter = jotaiStore.get(treeDataFilterAtom)
    if (
      isObject(dataFilter.ap) ||
      isObject(dataFilter.pop) ||
      isObject(dataFilter.tpop) ||
      isObject(dataFilter.tpopmassn) ||
      isObject(dataFilter.tpopfeldkontr) ||
      isObject(dataFilter.tpopfreiwkontr)
    ) {
      jotaiStore.set(treeDataFilterEmptyAtom)
    }

    const isUser = !!username

    // set last activeNodeArray
    // only if top domain was visited
    if (isUser && visitedTopDomain) {
      const activeNodeArray = jotaiStore.get(treeActiveNodeArrayAtom)
      return navigate?.(`/Daten/${activeNodeArray.join('/')}`)
    }
  })
}
