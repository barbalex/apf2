// @flow
import setOpenNodesFromActiveNodeArray from '../../../modules/setOpenNodesFromActiveNodeArray'

export default async ({
  activeNodeArray,
  mobxStore,
}: {
  activeNodeArray: Array<string>,
  client: Object,
}) => {
  mobxStore.setTreeKey({
    value: [...activeNodeArray],
    tree: 'tree',
    key: 'activeNodeArray',
  })
  // need to set openNodes
  setOpenNodesFromActiveNodeArray({ activeNodeArray, mobxStore })
}
