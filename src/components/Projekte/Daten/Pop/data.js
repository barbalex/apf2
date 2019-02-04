import gql from 'graphql-tag'

export default gql`
  query popByIdQuery($id: UUID!) {
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
      apByApId {
        id
        startJahr
      }
    }
    allPops {
      totalCount
      nodes {
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
  }
`
