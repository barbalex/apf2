import gql from 'graphql-tag'

export default gql`
  query erfkritByIdQuery($id: UUID!) {
    erfkritById(id: $id) {
      id
      apId
      erfolg
      kriterien
    }
  }
`
