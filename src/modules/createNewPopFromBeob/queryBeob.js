import gql from 'graphql-tag'

export default gql`
  query Query($id: UUID!) {
    beobById(id: $id) {
      id
      x
      y
      datum
      data
    }
  }
`
