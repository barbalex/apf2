import gql from 'graphql-tag'

export default gql`
  query tpopById($id: UUID!) {
    tpopById(id: $id) {
      id
      x: lv95X
      y: lv95Y
    }
  }
`
