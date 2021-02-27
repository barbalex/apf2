import setOpenNodesFromActiveNodeArray from '../../../modules/setOpenNodesFromActiveNodeArray'

const initiateDataFromUrl = async ({ activeNodeArray, store }) => {
  store.tree.setActiveNodeArray([...activeNodeArray])
  setOpenNodesFromActiveNodeArray({ activeNodeArray, store })
}

export default initiateDataFromUrl
