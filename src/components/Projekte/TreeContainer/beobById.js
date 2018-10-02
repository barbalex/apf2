import gql from 'graphql-tag'

export default gql`
  query beobById($id: UUID!) {
    beobById(id: $id) {
      id
      x
      y
    }
  }
`
