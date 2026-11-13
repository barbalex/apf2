import { isEqual } from 'es-toolkit'

import {
  navigateAtom,
  treeOpenNodesAtom,
  treeSetOpenNodesAtom,
  treeActiveNodeArrayAtom,
} from '../../../store/index.ts'
import type { Store } from 'jotai'

export const closeLowerNodes = async ({
  store,
  url,
  search,
}: {
  store: Store
  // url elements can be route params, which are typed string | undefined
  url: (string | number | undefined)[]
  search: string
}) => {
  const openNodes = store.get(treeOpenNodesAtom)
  const activeNodeArray = store.get(treeActiveNodeArrayAtom)
  const newOpenNodes = openNodes.filter((n) => {
    const partWithEqualLength = n.slice(0, url.length)
    return !isEqual(partWithEqualLength, url)
  })
  store.set(treeSetOpenNodesAtom, newOpenNodes)
  if (isEqual(activeNodeArray.slice(0, url.length), url)) {
    // active node will be closed
    // navigate to url
    const navigate = store.get(navigateAtom)
    if (navigate) {
      navigate(`/Daten/${url.join('/')}${search}`)
    }
  }
}
