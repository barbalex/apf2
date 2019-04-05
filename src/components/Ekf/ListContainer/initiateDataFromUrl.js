// @flow
import setOpenNodesFromActiveNodeArray from '../../../modules/setOpenNodesFromActiveNodeArray'

export default async ({
  activeNodeArray,
  mobxStore,
}: {
  activeNodeArray: Array<string>,
  mobxStore: Object,
}) => {
  mobxStore.tree.setActiveNodeArray([...activeNodeArray])
  setOpenNodesFromActiveNodeArray({ activeNodeArray, mobxStore })
}
