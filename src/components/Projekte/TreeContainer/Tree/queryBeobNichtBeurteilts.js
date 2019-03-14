import gql from 'graphql-tag'

export default gql`
  query BeobNichtBeurteiltsQuery(
    $ap: [UUID!]
    $isAp: Boolean!
    $withNodes: Boolean!
  ) {
    allVApbeobs(
      filter: {
        nichtZuordnen: { equalTo: false }
        apId: { in: $ap }
        tpopId: { isNull: true }
      }
      orderBy: DATUM_DESC
    ) @include(if: $isAp) {
      totalCount
      nodes @include(if: $withNodes) {
        id
        apId
        nichtZuordnen
        artId
        datum
        autor
        quelle
      }
    }
  }
`
