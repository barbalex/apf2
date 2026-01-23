import localForage from 'localforage'

import {
  store,
  navigateAtom,
  userNameAtom,
  treeActiveNodeArrayAtom,
} from '../store/index.ts'

const blacklist = [
  'overlays', // 2022.10.26 added overlay. Need to refresh or users will not get new ones
]

export const persistStore = () => {
  const username = store.get(userNameAtom)
  const navigate = store.get(navigateAtom)

  const visitedTopDomain = window.location.pathname === '/'

  const isUser = !!username

  // set last activeNodeArray
  // only if top domain was visited
  if (isUser && visitedTopDomain) {
    const activeNodeArray = store.get(treeActiveNodeArrayAtom)
    return navigate?.(`/Daten/${activeNodeArray.join('/')}`)
  }
}
