// @flow
import gql from 'graphql-tag'

import setOpenNodesFromActiveNodeArray from '../../../modules/setOpenNodesFromActiveNodeArray'

export default async ({
  activeNodeArray,
  client,
}: {
  activeNodeArray: Array<string>,
  client: Object,
}) => {
  await client.mutate({
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
      value: [...activeNodeArray],
      tree: 'tree',
      key: 'activeNodeArray',
    },
  })
  // need to set openNodes
  setOpenNodesFromActiveNodeArray({ activeNodeArray, client })
}
