import { isNodeOpen } from './isNodeOpen.ts'
import {
  store as jotaiStore,
  treeSetOpenNodesAtom,
  treeResetNodeLabelFilterKeepingApAtom,
} from '../../../store/index.ts'

export const openNode = async ({ node, openNodes }) => {
  // make sure this node's url is not yet contained
  // otherwise same nodes will be added multiple times!
  if (isNodeOpen({ openNodes, url: node.url })) return

  let newOpenNodes = [...openNodes, node.url]
  if (['tpopfeldkontr', 'tpopfreiwkontr'].includes(node.menuType)) {
    // automatically open zaehlFolder of tpopfeldkontr or tpopfreiwkontr
    newOpenNodes.push([...node.url, 'Zaehlungen'])
  }

  jotaiStore.set(treeSetOpenNodesAtom, newOpenNodes)

  if (node.menuType === 'ap') {
    // if ap is changed, need to empty nodeLabelFilter,
    // with exception of the ap key
    jotaiStore.set(treeResetNodeLabelFilterKeepingApAtom)
  }
}
