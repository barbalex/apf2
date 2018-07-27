// @flow
import gql from 'graphql-tag'
import app from 'ampersand-app'

import isNodeOpen from './isNodeOpen'
import treeNodeLabelFilterResetExceptAp from './treeNodeLabelFilterResetExceptAp.graphql'

export default async ({ tree, node }: { tree: Object, node: Object }) => {
  const { client } = app
  console.log('openNode:', { tree, node })
  // make sure this node's url is not yet contained
  // otherwise same nodes will be added multiple times!
  if (isNodeOpen(tree.openNodes, node.url)) return

  let newOpenNodes = [...tree.openNodes, node.url]
  if (['tpopfeldkontr'].includes(node.menuType)) {
    // automatically open zaehlFolder of tpopfeldkontr or tpopfreiwkontr
    newOpenNodes.push([...node.url, 'Zaehlungen'])
  }
  if (node.menuType === 'ziel') {
    // automatically open zielberFolder of ziel
    newOpenNodes.push([...node.url, 'Berichte'])
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
      key: 'openNodes',
    },
  })

  if (node.menuType === 'ap') {
    // if ap is changed, need to empty nodeLabelFilter,
    // with exception of the ap key
    await client.mutate({
      mutation: treeNodeLabelFilterResetExceptAp,
      variables: { tree: tree.name },
    })
  }
}
