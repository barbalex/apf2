import gql from 'graphql-tag'

export default gql`
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
`
