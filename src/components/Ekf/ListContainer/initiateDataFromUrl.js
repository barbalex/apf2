// @flow
import setOpenNodesFromActiveNodeArray from '../../../modules/setOpenNodesFromActiveNodeArray'

export default async ({
  activeNodeArray,
  store,
}: {
  activeNodeArray: Array<string>,
  store: Object,
}) => {
  store.tree.setActiveNodeArray([...activeNodeArray])
  setOpenNodesFromActiveNodeArray({ activeNodeArray, store })
}
