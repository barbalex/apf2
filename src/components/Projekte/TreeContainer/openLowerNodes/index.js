// @flow
import isEqual from 'lodash/isEqual'

export default ({
  tree,
  id,
  menuType
}: {
  tree: Object,
  id: String,
  menuType: String,
}) => {
   /**
   * 1. load all data
   * 2. build openNodes for all data using setOpenNodesFromActiveNodeArray
   * 3. add these nodes to existing openNodes
   * 4. make sure every nodeArray is unique in openNodes
   * 5. activeNodeArray stays same
   * 6. refresh tree
   */
  switch (menuType) {
    case 'popFolder':
      // TODO
      break;
    case 'pop':
      // TODO
      break;
    case 'tpopFolder':
      // TODO
      break;
    case 'tpop':
      // TODO
      break;
    case 'tpopfeldkontrFolder':
      // TODO
      break;
    case 'tpopfreiwkontrFolder':
      // TODO
      break;
    default:
      // do nothing
      break;
  }
}