import gql from 'graphql-tag'

export default gql`
  query BeobZugeordnetAssignPolylinesForMapQuery(
    $ap: [UUID!]
    $apIsActiveInMap: Boolean!
  ) {
    beobZugeordnetAssignPolylinesForMap: allVApbeobs(
      filter: {
        apId: { in: $ap }
        nichtZuordnen: { equalTo: false }
        tpopId: { isNull: false }
      }
    ) @include(if: $apIsActiveInMap) {
      nodes {
        id
        x
        y
      }
    }
  }
`
