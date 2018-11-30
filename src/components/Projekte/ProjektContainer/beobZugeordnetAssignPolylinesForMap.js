import gql from 'graphql-tag'

export default gql`
  query BeobZugeordnetAssignPolylinesForMapQuery(
    $ap: [UUID!]
    $beobZugeordnetAssignPolylinesIsActiveInMap: Boolean!
  ) {
    beobZugeordnetAssignPolylinesForMap: allVApbeobs(
      filter: {
        apId: { in: $ap }
        nichtZuordnen: { equalTo: false }
        tpopId: { isNull: false }
      }
    ) @include(if: $beobZugeordnetAssignPolylinesIsActiveInMap) {
      nodes {
        id
        x
        y
      }
    }
  }
`
