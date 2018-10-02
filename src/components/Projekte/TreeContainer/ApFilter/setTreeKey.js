import gql from 'graphql-tag'

export default gql`
  mutation setTreeKey($value: Array!, $tree: String!, $key: String!) {
    setTreeKey(tree: $tree, key: $key, value: $value) @client {
      tree @client {
        name
        apFilter
        activeNodeArray
        openNodes
        __typename: Tree
      }
      tree2 @client {
        name
        apFilter
        activeNodeArray
        openNodes
        __typename: Tree
      }
    }
  }
`
