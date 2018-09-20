//@flow
import isEqual from 'lodash/isEqual'
import app from 'ampersand-app'

import setTreeKey from './setTreeKey.graphql'

export default async ({
  tree,
  url,
  refetchTree,
}: {
  tree: Object,
  url: Array<String>,
  refetchTree: () => void,
}) => {
  const { client } = app
  const { openNodes, activeNodeArray } = tree
  const newOpenNodes = openNodes.filter(n => {
    const partWithEqualLength = n.slice(0, url.length)
    return !isEqual(partWithEqualLength, url)
  })
  await client.mutate({
    mutation: setTreeKey,
    variables: {
      tree: tree.name,
      value: newOpenNodes,
      key: 'openNodes',
    },
  })
  if (isEqual(activeNodeArray.slice(0, url.length), url)) {
    // active node will be closed
    // set activeNodeArray to url
    await client.mutate({
      mutation: setTreeKey,
      variables: {
        tree: tree.name,
        value: url,
        key: 'activeNodeArray',
      },
    })
  }
}
