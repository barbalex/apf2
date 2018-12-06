//@flow
import isEqual from 'lodash/isEqual'
import { getSnapshot } from 'mobx-state-tree'

export default async ({
  treeName,
  url,
  refetchTree,
  mobxStore,
}: {
  treeName: string,
  url: Array<String>,
  refetchTree: () => void,
}) => {
  const { setTreeKey } = mobxStore
  const openNodes = getSnapshot(mobxStore[treeName].openNodes)
  const activeNodeArray = getSnapshot(mobxStore[treeName].activeNodeArray)
  const newOpenNodes = openNodes.filter(n => {
    const partWithEqualLength = n.slice(0, url.length)
    return !isEqual(partWithEqualLength, url)
  })
  setTreeKey({
    tree: treeName,
    value: newOpenNodes,
    key: 'openNodes',
  })
  if (isEqual(activeNodeArray.slice(0, url.length), url)) {
    // active node will be closed
    // set activeNodeArray to url
    setTreeKey({
      tree: treeName,
      value: url,
      key: 'activeNodeArray',
    })
  }
}
