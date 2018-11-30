import gql from 'graphql-tag'

export default gql`
  query BeobZugeordnetForMapQuery(
    $ap: [UUID!]
    $beobZugeordnetIsActiveInMap: Boolean!
  ) {
    beobZugeordnetForMap: allVApbeobs(
      filter: {
        apId: { in: $ap }
        nichtZuordnen: { equalTo: false }
        tpopId: { isNull: false }
      }
    ) @include(if: $beobZugeordnetIsActiveInMap) {
      nodes {
        id
        x
        y
      }
    }
  }
`
