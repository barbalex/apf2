import gql from 'graphql-tag'

export default gql`
  query BeobNichtBeurteiltForMapQuery(
    $ap: [UUID!]
    $apIsActiveInMap: Boolean!
  ) {
    beobNichtBeurteiltForMap: allVApbeobs(
      filter: {
        apId: { in: $ap }
        nichtZuordnen: { equalTo: false }
        tpopId: { isNull: true }
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
