import { isNodeOpen } from '../isNodeOpen.ts'
import { openNode } from '../openNode.ts'
import {
  store,
  navigateAtom,
  setTreeLastTouchedNodeAtom,
  treeOpenNodesAtom,
  treeActiveNodeArrayAtom,
} from '../../../../store/index.ts'

export const toggleNode = ({ node, search, onlyShowActivePath = false }) => {
  if (!node.url) throw new Error('passed node has no url')

  const navigate = store.get(navigateAtom)

  if (!navigate || typeof navigate !== 'function') {
    console.error('navigate is not a function:', navigate)
    throw new Error('navigate function not available in Jotai store')
  }

  const openNodes = store.get(treeOpenNodesAtom)
  const activeNodeArray = store.get(treeActiveNodeArrayAtom)

  let newActiveNodeArray = []
  if (!isNodeOpen({ openNodes, url: node.url })) {
    // node is closed
    // open it and make it the active node
    openNode({ node, openNodes })
    newActiveNodeArray = [...node.url]
    // some elements are numbers but they are contained in url as text
  } else if (node.urlLabel == activeNodeArray.slice(-1)[0]) {
    // the node is open
    // AND it is the active node
    // BEFORE 2024.12.12:
    // make it's parent the new active node
    // newActiveNodeArray = [...node.url]
    // newActiveNodeArray.pop()
    // AFTER 2024.12.12:
    // don't do anything
    return
  } else {
    // the node is open
    // but not the active node
    // make it the new active node
    newActiveNodeArray = [...node.url]
  }
  // DO NOT add singleElementName to url if onlyShowActivePath is true
  // as it prevents active Path from being shown
  navigate(
    `/Daten/${newActiveNodeArray.join('/')}${node.singleElementName && !onlyShowActivePath ? `/${node.singleElementName}` : ''}${search}`,
  )
  store.set(setTreeLastTouchedNodeAtom, node.url)
}
