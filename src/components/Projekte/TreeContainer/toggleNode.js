// @flow
import clone from 'lodash/clone'
import gql from 'graphql-tag'
import app from 'ampersand-app'

import isNodeOpen from './isNodeOpen'
import isNodeInActiveNodePath from './isNodeInActiveNodePath'
import openNode from './openNode'

export default ({
  tree,
  node,
  nodeFilterState,
}: {
  tree: Object,
  node: Object,
  nodeFilterState: Object,
}): any => {
  if (!node.url) throw new Error('passed node has no url')

  // TODO: always set showFilter false if is true
  if (nodeFilterState) {
    const show = !!nodeFilterState.state[tree.name].activeTable
    if (show) {
      nodeFilterState.setActiveTable({ treeName: tree.name, activeTable: null })
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
    openNode({ tree, node })
  }

  app.client.mutate({
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
