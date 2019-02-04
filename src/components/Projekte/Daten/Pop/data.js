import gql from 'graphql-tag'

export default gql`
  query popByIdQuery($id: UUID!, $showFilter: Boolean!) {
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
    allPops @include(if: $showFilter) {
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
