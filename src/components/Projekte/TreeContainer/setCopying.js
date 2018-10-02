import gql from 'graphql-tag'

export default gql`
  mutation setCopying(
    $table: String!
    $id: UUID!
    $label: String!
    $withNextLevel: Boolean!
  ) {
    setCopying(
      table: $table
      id: $id
      label: $label
      withNextLevel: $withNextLevel
    ) @client {
      table
      id
      label
      withNextLevel
    }
  }
`
