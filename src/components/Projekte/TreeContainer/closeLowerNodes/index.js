//@flow
import isEqual from 'lodash/isEqual'

export default async ({
  tree,
  url,
  refetchTree,
  mobxStore,
}: {
  tree: Object,
  url: Array<String>,
  refetchTree: () => void,
}) => {
  const { setTreeKey } = mobxStore
  const { openNodes, activeNodeArray } = tree
  const newOpenNodes = openNodes.filter(n => {
    const partWithEqualLength = n.slice(0, url.length)
    return !isEqual(partWithEqualLength, url)
  })
  setTreeKey({
    tree: tree.name,
    value: newOpenNodes,
    key: 'openNodes',
  })
  if (isEqual(activeNodeArray.slice(0, url.length), url)) {
    // active node will be closed
    // set activeNodeArray to url
    setTreeKey({
      tree: tree.name,
      value: url,
      key: 'activeNodeArray',
    })
  }
}
