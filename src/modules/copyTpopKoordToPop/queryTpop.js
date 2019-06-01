import gql from 'graphql-tag'

export default gql`
  query Query($id: UUID!) {
    tpopById(id: $id) {
      id
      popId
      geomPoint
    }
  }
`
