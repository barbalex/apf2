import gql from 'graphql-tag'

export default gql`
  query BeobNichtBeurteiltForMapQuery(
    $ap: [UUID!]
    $beobNichtBeurteiltIsActiveInMap: Boolean!
  ) {
    beobNichtBeurteiltForMap: allVApbeobs(
      filter: {
        apId: { in: $ap }
        nichtZuordnen: { equalTo: false }
        tpopId: { isNull: true }
      }
    ) @include(if: $beobNichtBeurteiltIsActiveInMap) {
      nodes {
        id
        x
        y
      }
    }
  }
`
