import gql from 'graphql-tag'

export default gql`
  query projektById($id: UUID!) {
    projektById(id: $id) {
      id
      name
    }
  }
`
