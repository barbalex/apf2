import getOpenNodesFromActiveNodeArray from '../modules/getOpenNodesFromActiveNodeArray'

const setOpenNodesFromActiveNodeArray = ({ activeNodeArray, store }) =>
  store.tree.setOpenNodes(getOpenNodesFromActiveNodeArray(activeNodeArray))

export default setOpenNodesFromActiveNodeArray
