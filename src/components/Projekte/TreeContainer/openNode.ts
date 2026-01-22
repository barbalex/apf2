import { isNodeOpen } from './isNodeOpen.ts'
import {
  store as jotaiStore,
  treeSetOpenNodesAtom,
} from '../../../JotaiStore/index.ts'

export const openNode = async ({ node, openNodes, store }) => {
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
    store.tree.nodeLabelFilter = {
      ap: store.tree.nodeLabelFilter.ap,
      pop: null,
      tpop: null,
      tpopkontr: null,
      tpopfeldkontr: null,
      tpopfreiwkontr: null,
      tpopkontrzaehl: null,
      tpopmassn: null,
      ziel: null,
      erfkrit: null,
      apber: null,
      apberuebersicht: null,
      idealbiotop: null,
      assozart: null,
      ekzaehleinheit: null,
      ekfrequenz: null,
      popber: null,
      popmassnber: null,
      tpopber: null,
      tpopmassnber: null,
      apart: null,
      projekt: null,
      beob: null,
      beobprojekt: null,
      adresse: null,
      gemeinde: null,
      user: null,
    }
  }
}
