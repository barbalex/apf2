import gql from 'graphql-tag'

export default gql`
  query erfkritById($id: UUID!) {
    erfkritById(id: $id) {
      id
      apId
      erfolg
      kriterien
    }
  }
`
