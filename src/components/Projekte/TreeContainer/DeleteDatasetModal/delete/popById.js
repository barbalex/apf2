import gql from 'graphql-tag'

export default gql`
  query popById($id: UUID!) {
    popById(id: $id) {
      id
      apId
      nr
      name
      status
      statusUnklar
      statusUnklarBegruendung
      bekanntSeit
      x
      y
    }
  }
`
