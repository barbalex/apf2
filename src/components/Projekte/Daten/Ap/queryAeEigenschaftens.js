import gql from 'graphql-tag'

export default gql`
  query ApAeEigenschaftensQuery(
    $showData: Boolean!
    $showFilter: Boolean!
    $apId: UUID!
  ) {
    forData: allAeEigenschaftens(
      filter: {
        or: [
          { apByArtIdExists: false }
          { apByArtId: { id: { equalTo: $apId } } }
        ]
      }
      orderBy: ARTNAME_ASC
    ) @include(if: $showData) {
      nodes {
        value: id
        label: artname
      }
    }
    forFilter: allAeEigenschaftens(
      filter: { apByArtIdExists: true }
      orderBy: ARTNAME_ASC
    ) @include(if: $showFilter) {
      nodes {
        value: id
        label: artname
      }
    }
  }
`
