// @flow
import isEqual from 'lodash/isEqual'
import clone from 'lodash/clone'
import gql from 'graphql-tag'

import isNodeOpen from './isNodeOpen'

export default ({
  tree,
  node,
  client
}:{
  tree: Object,
  node: Object,
  client: Object
}): any => {
  if (!node.url) throw new Error('passed node has no url')

  let newOpenNodes = clone(tree.openNodes)
  if (isNodeOpen(tree.openNodes, node.url)) {
    newOpenNodes = newOpenNodes.filter(n => !isEqual(n, node.url))
  } else {
    newOpenNodes.push(node.url)
  }
  client.mutate({
    mutation: gql`
      mutation setTreeKey($value: Array!, $tree: String!, $key: String!) {
        setTreeKey(tree: $tree, key: $key, value: $value) @client {
          tree @client {
            name
            activeNodeArray
            openNodes
            apFilter
            nodeLabelFilter
            __typename: Tree
          }
        }
      }
    `,
    variables: {
      value: newOpenNodes,
      tree: tree.name,
      key: 'openNodes'
    }
  })
}
