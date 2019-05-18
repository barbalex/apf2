import getOpenNodesFromActiveNodeArray from "../modules/getOpenNodesFromActiveNodeArray"

export default ({ activeNodeArray, store }) =>
  store.tree.setOpenNodes(getOpenNodesFromActiveNodeArray(activeNodeArray))
