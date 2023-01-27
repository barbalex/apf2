import localForage from 'localforage'
import MobxStore from '../store'
//import { onPatch } from 'mobx-state-tree'
import { getSnapshot } from 'mobx-state-tree'

import initializeIdb from '../modules/initializeIdb'
import buildClient from '../client'
import isObject from '../modules/isObject'

import setUserFromIdb from '../modules/setUserFromIdb'

const StorePersister = () => {
  const idb = initializeIdb()
  const store = MobxStore.create()
  const client = buildClient({ store })

  const visitedTopDomain = window.location.pathname === '/'
  const blacklist = [
    'user',
    'notifications',
    'hideMapControls',
    'overlays', // 2022.10.26 added overlay. Need to refresh or users will not get new ones
    'apfloraLayers', // 2022.10.28 added. Need to refresh or users will not get new ones
  ]

  import('mst-persist').then((module) =>
    module
      .default('store', store, {
        storage: localForage,
        jsonify: false,
        blacklist,
      })
      .then(async () => {
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
          // console.log(
          //   'StorePersister navigating to',
          //   `/Daten/${store.tree.activeNodeArray.join('/')}`,
          // )
          return store.navigate?.(
            `/Daten/${store.tree.activeNodeArray.join('/')}`,
          )
        }
      }),
  )

  return null
}

export default StorePersister
