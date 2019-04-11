import setOpenNodesFromActiveNodeArray from '../../../modules/setOpenNodesFromActiveNodeArray'

export default async ({ activeNodeArray, store }) => {
  store.tree.setActiveNodeArray([...activeNodeArray])
  setOpenNodesFromActiveNodeArray({ activeNodeArray, store })
}
