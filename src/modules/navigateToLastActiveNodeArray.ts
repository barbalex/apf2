import localForage from 'localforage'

import {
  store,
  navigateAtom,
  userNameAtom,
  treeActiveNodeArrayAtom,
} from '../store/index.ts'

export const navigateToLastActiveNodeArray = () => {
  const username = store.get(userNameAtom)
  const navigate = store.get(navigateAtom)
  const activeNodeArray = store.get(treeActiveNodeArrayAtom)

  const visitedTopDomain = window.location.pathname === '/'

  const isUser = !!username

  // set last activeNodeArray
  // only if top domain was visited
  if (isUser && visitedTopDomain) {
    return navigate?.(`/Daten/${activeNodeArray.join('/')}`)
  }
}
