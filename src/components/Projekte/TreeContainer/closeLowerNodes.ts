import { isEqual } from 'es-toolkit'

import {
  store as jotaiStore,
  navigateAtom,
  treeOpenNodesAtom,
  treeSetOpenNodesAtom,
  treeActiveNodeArrayAtom,
} from '../../../store/index.ts'

export const closeLowerNodes = async ({ url, search }) => {
  const openNodes = jotaiStore.get(treeOpenNodesAtom)
  const activeNodeArray = jotaiStore.get(treeActiveNodeArrayAtom)
  const newOpenNodes = openNodes.filter((n) => {
    const partWithEqualLength = n.slice(0, url.length)
    return !isEqual(partWithEqualLength, url)
  })
  jotaiStore.set(treeSetOpenNodesAtom, newOpenNodes)
  if (isEqual(activeNodeArray.slice(0, url.length), url)) {
    // active node will be closed
    // navigate to url
    const navigate = jotaiStore.get(navigateAtom)
    navigate(`/Daten/${url.join('/')}${search}`)
  }
}
