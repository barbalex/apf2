import gql from 'graphql-tag'

export default gql`
  mutation setCopyingBiotop($id: UUID, $label: String) {
    setCopyingBiotop(id: $id, label: $label) @client {
      id
      label
    }
  }
`
