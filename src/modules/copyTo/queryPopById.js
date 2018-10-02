import gql from 'graphql-tag'

export default gql`
  query Query($id: UUID!) {
    popById(id: $id) {
      id
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
