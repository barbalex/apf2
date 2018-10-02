import gql from 'graphql-tag'

export default gql`
  query beobByIdQuery($id: UUID!) {
    beobById(id: $id) {
      id
      data
    }
  }
`
