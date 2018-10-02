import gql from 'graphql-tag'

export default gql`
  query userById($id: UUID!) {
    userById(id: $id) {
      id
      name
      role
      email
    }
  }
`
