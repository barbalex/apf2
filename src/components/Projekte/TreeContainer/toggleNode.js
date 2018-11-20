// @flow
import clone from 'lodash/clone'
import gql from 'graphql-tag'

import isNodeOpen from './isNodeOpen'
import isNodeInActiveNodePath from './isNodeInActiveNodePath'
import openNode from './openNode'

export default ({
  tree,
  node,
  nodeFilter,
  nodeFilterSetActiveTable,
  client,
}: {
  tree: Object,
  node: Object,
  nodeFilter: Object,
  nodeFilterSetActiveTable: () => void,
  client: Object,
}): any => {
  if (!node.url) throw new Error('passed node has no url')

  // TODO: always set showFilter false if is true
  if (nodeFilter) {
    const show = !!nodeFilter[tree.name].activeTable
    if (show) {
      nodeFilterSetActiveTable({ treeName: tree.name, activeTable: null })
    }
  }

  const newActiveNodeArray = clone(node.url)
  const nodeIsOpen = isNodeOpen(tree.openNodes, node.url)
  if (nodeIsOpen && isNodeInActiveNodePath(node, tree.activeNodeArray)) {
    // need to check if node is last in activeNodePath
    if (node.url.length === tree.activeNodeArray.length) {
      /**
       * dont do anything:
       * klicked node should always be / remain active
       */
      // newActiveNodeArray.pop()
    } else {
      // leave newActiveNodeArray as it is
    }
  } else if (!nodeIsOpen) {
    openNode({ tree, node, client })
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
      value: newActiveNodeArray,
      tree: tree.name,
      key: 'activeNodeArray',
    },
  })
}
