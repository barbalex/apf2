// @flow
import gql from 'graphql-tag'

export default ({
  client,
  activeNodeArray
}:{
  client: Object,
  activeNodeArray: Array<String>
}): void => {
  const openNodes = []
  activeNodeArray.forEach((n, index) =>
    openNodes.push(activeNodeArray.slice(0, index + 1))
  )
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
    variables: { value: openNodes, tree: 'tree', key: 'openNodes' }
  })
}
