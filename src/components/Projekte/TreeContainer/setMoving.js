import gql from 'graphql-tag'

export default gql`
  mutation setMoving($table: String!, $id: UUID!, $label: String!) {
    setMoving(table: $table, id: $id, label: $label) @client {
      table
      id
      label
    }
  }
`
