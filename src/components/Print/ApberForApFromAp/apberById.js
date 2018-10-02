import gql from 'graphql-tag'

export default gql`
  query apberById($apberId: UUID!) {
    apberById(id: $apberId) {
      id
      jahr
    }
  }
`
