// for sorting see:
// //stackoverflow.com/questions/13211709/javascript-sort-array-by-multiple-number-fields
// also: needed to account for elements not having the next array elements
// to be sorted before those that have
// that is why there is if (a !== 0 && !a)

import projektNodes from '../../../modules/nodes/projekt'
import apFolderNodes from '../../../modules/nodes/apFolder'
import apberuebersichtFolderNodes
  from '../../../modules/nodes/apberuebersichtFolder'
import apberuebersichtNodes from '../../../modules/nodes/apberuebersicht'

const compare = (a, b) => {
  // sort a before, if it has no value at this index
  if (a !== 0 && !a) return -1
  // sort a after if b has no value at this index
  if (b !== 0 && !b) return 1
  // sort a before if its value is smaller
  return a - b
}

export default (store, tree) => {
  const { openNodes } = tree

  let nodes = projektNodes(store, tree)

  openNodes.forEach(openNode => {
    const projId = openNode.length > 1 ? openNode[1] : null
    if (openNode.length === 2) {
      nodes = [...nodes, ...apFolderNodes(store, tree, projId)]
      nodes = [...nodes, ...apberuebersichtFolderNodes(store, tree, projId)]
    }
    if (openNode.length === 3 && openNode[2] === 'AP-Berichte') {
      nodes = [...nodes, ...apberuebersichtNodes(store, tree, projId)]
    }
  })

  /**
   * As all nodes are now in one flat list,
   * we need to sort them
   *
   * This is the sorting algorithm:
   *
   * compare the sort array value in the nodes
   * to determine sorting
   *
   * compare arrays element by element, starting with first
   * if a has no value at this index (> a is folder), sort a before b
   * if b has no value at this index (> b is folder), sort a after b
   * if a is smaller than b, sort a before b
   * if both array elements at this index are same,
   * compare values at next index
   */
  return nodes.sort(
    (a, b) =>
      compare(a.sort[0], b.sort[0]) ||
      compare(a.sort[1], b.sort[1]) ||
      compare(a.sort[2], b.sort[2]) ||
      compare(a.sort[3], b.sort[3]) ||
      compare(a.sort[4], b.sort[4]) ||
      compare(a.sort[5], b.sort[5]) ||
      compare(a.sort[6], b.sort[6]) ||
      compare(a.sort[7], b.sort[7]) ||
      compare(a.sort[8], b.sort[8]) ||
      compare(a.sort[9], b.sort[9]) ||
      compare(a.sort[10], b.sort[10])
  )
}
