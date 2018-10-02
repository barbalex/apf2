import gql from 'graphql-tag'

export default gql`
  query BeobZugeordnetForMapQuery($ap: [UUID!], $apIsActiveInMap: Boolean!) {
    beobZugeordnetForMap: allVApbeobs(
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
