import { useEffect } from 'react'
import localForage from 'localforage'
//import { onPatch } from 'mobx-state-tree'
import { getSnapshot } from 'mobx-state-tree'
import { persist } from 'mst-persist'

import isObject from '../modules/isObject'

import setUserFromIdb from '../modules/setUserFromIdb'

const blacklist = [
  'user',
  'notifications',
  'hideMapControls',
  'overlays', // 2022.10.26 added overlay. Need to refresh or users will not get new ones
  'apfloraLayers', // 2022.10.28 added. Need to refresh or users will not get new ones
]

const StorePersister = ({ client, store, idb }) => {
  const visitedTopDomain = window.location.pathname === '/'
  useEffect(() => {
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
      const dataFilterTreeAp = getSnapshot(store.tree.dataFilter.ap)
      const dataFilterTreePop = getSnapshot(store.tree.dataFilter.pop)
      const dataFilterTreeTpop = getSnapshot(store.tree.dataFilter.tpop)
      const dataFilterTreeTpopmassn = getSnapshot(
        store.tree.dataFilter.tpopmassn,
      )
      const dataFilterTreeTpopfeldkontr = getSnapshot(
        store.tree.dataFilter.tpopfeldkontr,
      )
      const dataFilterTreeTpopfreiwkontr = getSnapshot(
        store.tree.dataFilter.tpopfreiwkontr,
      )
      if (
        isObject(dataFilterTreeAp) ||
        isObject(dataFilterTreePop) ||
        isObject(dataFilterTreeTpop) ||
        isObject(dataFilterTreeTpopmassn) ||
        isObject(dataFilterTreeTpopfeldkontr) ||
        isObject(dataFilterTreeTpopfreiwkontr)
      ) {
        [store.dataFilterEmpty()]
      }

      const username = await setUserFromIdb({ idb, store })
      const isUser = !!username

      if (window.Cypress) {
        // enable directly using these in tests
        window.__client__ = client
        window.__store__ = store
        window.__idb__ = idb
      }

      window.store = store

      // set last activeNodeArray
      // only if top domain was visited
      if (isUser && visitedTopDomain) {
        return store.navigate?.(
          `/Daten/${store.tree.activeNodeArray.join('/')}`,
        )
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, idb, store])

  return null
}

export default StorePersister
