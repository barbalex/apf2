import gql from 'graphql-tag'

export default gql`
  query tpopById($id: UUID!) {
    tpopById(id: $id) {
      id
      x
      y
    }
  }
`
