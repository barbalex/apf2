import getOpenNodesFromActiveNodeArray from '../modules/getOpenNodesFromActiveNodeArray.js'

const setOpenNodesFromActiveNodeArray = ({ activeNodeArray, store }) =>
  store.tree.setOpenNodes(getOpenNodesFromActiveNodeArray(activeNodeArray))

export default setOpenNodesFromActiveNodeArray
